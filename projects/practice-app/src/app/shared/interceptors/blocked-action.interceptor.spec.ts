import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { BlockedActionInterceptor, SKIP_BLOCKED_ACTION_TOAST } from './blocked-action.interceptor';

describe('BlockedActionInterceptor (NAS-031)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toastr = jasmine.createSpyObj('ToastrService', ['warning']);
    const translate = { instant: (key: string) => key };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BlockedActionInterceptor, multi: true },
        { provide: ToastrService, useValue: toastr },
        { provide: TranslateService, useValue: translate },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function fail403(body: any, headers?: HttpHeaders) {
    let received: any;
    http.post('/api/practice/tasks/', {}, { headers }).subscribe({ error: e => received = e });
    const req = httpMock.expectOne('/api/practice/tasks/');
    req.flush(body, { status: 403, statusText: 'Forbidden' });
    return { received, req };
  }

  ['permission_denied', 'plan_feature_missing', 'plan_limit_reached'].forEach(code => {
    it(`muestra el mensaje de ${code} y re-lanza el error`, () => {
      const { received } = fail403({ detail: 'x', code });

      expect(toastr.warning).toHaveBeenCalledOnceWith(
        `errorMessages.blockedAction.${code}`,
        'errorMessages.blockedAction.title'
      );
      expect(received.status).toBe(403);
    });
  });

  it('ignora el 403 sin code (suscripción con pago pendiente)', () => {
    fail403({ detail: 'You do not have permission to perform this action.' });

    expect(toastr.warning).not.toHaveBeenCalled();
  });

  it('ignora otros status aunque traigan code', () => {
    http.get('/api/x/').subscribe({ error: () => {} });
    httpMock.expectOne('/api/x/').flush({ code: 'permission_denied' }, { status: 400, statusText: 'Bad Request' });

    expect(toastr.warning).not.toHaveBeenCalled();
  });

  it('respeta el opt-out por header y no lo envía al backend', () => {
    const { req } = fail403({ code: 'permission_denied' }, new HttpHeaders({ [SKIP_BLOCKED_ACTION_TOAST]: '1' }));

    expect(toastr.warning).not.toHaveBeenCalled();
    expect(req.request.headers.has(SKIP_BLOCKED_ACTION_TOAST)).toBeFalse();
  });
});
