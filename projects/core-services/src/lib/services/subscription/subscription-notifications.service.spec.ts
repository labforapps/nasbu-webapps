import { TestBed } from '@angular/core/testing';
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
