import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AuthService } from '../security/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { WebsocketService } from '../application/websocket.service';
import { SubscriptionNotificationsService } from './subscription-notifications.service';

describe('SubscriptionNotificationsService preferences', () => {
  let service: SubscriptionNotificationsService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'config', useValue: { serverUrl: '/api' } },
        { provide: WebsocketService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: ToastrService, useValue: {} }
      ]
    });
    service = TestBed.inject(SubscriptionNotificationsService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('queries preferences for the selected subscription', () => {
    service.getPreferences('tenant-a').subscribe();
    const request = http.expectOne('/api/subscription/notification_preferences/?subscription=tenant-a');
    expect(request.request.method).toBe('GET');
    request.flush({ subscription: 'tenant-a', preferences: [] });
  });

  it('sends only the email preference: the dashboard is mandatory', () => {
    service.savePreferences('tenant-a', [
      { code: 'task_completed', category: 'tasks', dashboard: true, email: true }
    ]).subscribe();
    const request = http.expectOne('/api/subscription/notification_preferences/');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ subscription: 'tenant-a', preferences: [
      { code: 'task_completed', email: true }
    ] });
    request.flush({ subscription: 'tenant-a', preferences: [] });
  });
});

describe('SubscriptionNotificationsService live notifications', () => {
  let service: SubscriptionNotificationsService;
  let http: HttpTestingController;
  let live: Subject<any>;
  let connected: BehaviorSubject<boolean>;
  let websocket: any;
  let toastr: any;

  beforeEach(() => {
    live = new Subject<any>();
    connected = new BehaviorSubject<boolean>(false);
    websocket = { connect: jasmine.createSpy('connect').and.returnValue(live), connected$: connected };
    toastr = jasmine.createSpyObj('toastr', ['info']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'config', useValue: { serverUrl: '/api', notificationsWebSocketUrl: 'wss://ws.test/dev' } },
        { provide: WebsocketService, useValue: websocket },
        { provide: AuthService, useValue: { getCognitoAccessToken: () => of('access.token') } },
        { provide: ToastrService, useValue: toastr }
      ]
    });
    service = TestBed.inject(SubscriptionNotificationsService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('connects with the access token and emits live notifications', () => {
    const emitted: any[] = [];
    const subscription = service.getNotifications('tenant-a').subscribe(items => emitted.push(items));
    http.expectOne('/api/subscription/notifications/?subscription=tenant-a').flush([]);

    const urlFactory = websocket.connect.calls.mostRecent().args[0];
    let url = '';
    urlFactory().subscribe((value: string) => url = value);
    expect(url).toBe('wss://ws.test/dev?subscriptionId=tenant-a&token=access.token');
    expect(url).not.toContain('userId');

    live.next({ uuid: 'n1', title: 'Nueva tarea asignada' });
    expect(emitted[emitted.length - 1]).toEqual([{ uuid: 'n1', title: 'Nueva tarea asignada' }]);
    expect(toastr.info).toHaveBeenCalledWith('Nueva tarea asignada');
    subscription.unsubscribe();
  });

  it('keeps the live stream (and the socket) alive when the inbox request fails', () => {
    const emitted: any[] = [];
    let failed = false;
    const subscription = service.getNotifications('tenant-a').subscribe({
      next: items => emitted.push(items), error: () => failed = true });
    http.expectOne('/api/subscription/notifications/?subscription=tenant-a')
      .flush({ detail: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

    live.next({ uuid: 'n2', title: 'Tarea vencida' });
    expect(failed).toBeFalse();
    expect(subscription.closed).toBeFalse();
    expect(emitted).toEqual([[{ uuid: 'n2', title: 'Tarea vencida' }]]);
    subscription.unsubscribe();
  });

  it('polls the inbox only while the socket is not connected', fakeAsync(() => {
    const subscription = service.getNotifications('tenant-a').subscribe();
    http.expectOne('/api/subscription/notifications/?subscription=tenant-a').flush([]);

    tick(service.pollingIntervalMs);
    http.expectOne('/api/subscription/notifications/?subscription=tenant-a').flush([]);

    connected.next(true);
    tick(service.pollingIntervalMs);
    http.expectNone('/api/subscription/notifications/?subscription=tenant-a');

    subscription.unsubscribe();
    discardPeriodicTasks();
  }));
});
