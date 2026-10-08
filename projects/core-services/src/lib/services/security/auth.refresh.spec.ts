import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService.refreshUserInfo (NAS-073)', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const userInfo = (perms: string[]) => ({
    subscriptions: [
      { subscription: { uuid: 'sub-1' }, member_type: 'O', permissions: ['view_task'] },
      { subscription: { uuid: 'sub-2' }, member_type: 'O', permissions: perms },
    ],
  });

  beforeEach(() => {
    localStorage.removeItem('ssid');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: 'config', useValue: { serverUrl: '/api' } }],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('ssid');
  });

  it('vuelve a pedir /security/me/ aunque haya datos cacheados y conserva la suscripción elegida', () => {
    service.fetchUserInfo().subscribe();
    http.expectOne('/api/security/me/').flush(userInfo([]));
    service.selectSubscription('sub-2');

    service.fetchUserInfo().subscribe();
    http.expectNone('/api/security/me/');

    service.refreshUserInfo().subscribe();
    http.expectOne('/api/security/me/').flush(userInfo(['add_documentsignaturerequest']));

    const stored = service.getUserInfoFromLocalStorage();
    expect(stored?.ssid?.uuid).toBe('sub-2');
    expect(stored?.permissions).toContain('add_documentsignaturerequest');
  });
});
