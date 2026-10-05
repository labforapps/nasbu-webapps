import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BlockedActionInterceptor, SKIP_BLOCKED_ACTION_TOAST } from './blocked-action.interceptor';

/** Subconjunto de assets/i18n/es.json usado por el interceptor. */
const ES = {
  errorMessages: {
    blockedAction: {
      title: 'Acción no disponible',
      permission_denied: 'No tienes acceso a esta acción por el tipo de permiso con que cuentas.',
      plan_feature_missing: 'Tu plan actual no incluye esta función.',
      plan_limit_reached: 'Alcanzaste el límite de tu plan para esta función.',
      features: {
        users: { missing: 'Tu plan actual no incluye usuarios adicionales.', limit: 'Alcanzaste el límite de {{contracted}} usuarios de tu plan.' },
        storage: { missing: 'Tu plan actual no incluye almacenamiento en la nube.', limit: 'Alcanzaste el límite de almacenamiento de tu plan.' },
        signature_requests: { missing: 'Tu plan actual no incluye la firma electrónica.', limit: 'Alcanzaste el límite de {{contracted}} firmas electrónicas de tu plan.' },
      },
    },
  },
};

describe('BlockedActionInterceptor (NAS-031)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toastr = jasmine.createSpyObj('ToastrService', ['warning']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BlockedActionInterceptor, multi: true },
        { provide: ToastrService, useValue: toastr },
      ],
    });

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', ES);
    translate.use('es');

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

  function expectToast(message: string) {
    expect(toastr.warning).toHaveBeenCalledOnceWith(message, 'Acción no disponible');
  }

  it('permiso: muestra el mensaje de permiso y re-lanza el error', () => {
    const { received } = fail403({ detail: 'x', code: 'permission_denied' });

    expectToast('No tienes acceso a esta acción por el tipo de permiso con que cuentas.');
    expect(received.status).toBe(403);
  });

  it('plan sin la función: nombra la función según feature_code', () => {
    fail403({ code: 'plan_feature_missing', feature_code: 'signature_requests' });

    expectToast('Tu plan actual no incluye la firma electrónica.');
  });

  it('límite: nombra la función y la cantidad contratada', () => {
    fail403({ code: 'plan_limit_reached', feature_code: 'users', contracted: 3, used: 3 });

    expectToast('Alcanzaste el límite de 3 usuarios de tu plan.');
  });

  it('límite de almacenamiento: no muestra la cantidad en bytes', () => {
    fail403({ code: 'plan_limit_reached', feature_code: 'storage', contracted: 1000000000, used: 1000000000 });

    expectToast('Alcanzaste el límite de almacenamiento de tu plan.');
  });

  it('límite sin cantidad contratada: usa el mensaje genérico', () => {
    fail403({ code: 'plan_limit_reached', feature_code: 'users', contracted: null, used: null });

    expectToast('Alcanzaste el límite de tu plan para esta función.');
  });

  it('función sin texto propio o sin feature_code: usa el mensaje genérico', () => {
    fail403({ code: 'plan_feature_missing', feature_code: 'nueva_funcion' });
    expectToast('Tu plan actual no incluye esta función.');

    toastr.warning.calls.reset();
    fail403({ code: 'plan_feature_missing' });
    expectToast('Tu plan actual no incluye esta función.');
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
