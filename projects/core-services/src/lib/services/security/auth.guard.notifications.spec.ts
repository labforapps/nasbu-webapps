import { of } from 'rxjs';
import { AuthGuard, consumeReturnUrl, RETURN_URL_KEY } from './auth.guard';

describe('AuthGuard and notification links', () => {
  let loggedIn: boolean;
  let guard: AuthGuard;
  const router: any = { parseUrl: (url: string) => ({ redirectedTo: url }) };

  beforeEach(() => {
    sessionStorage.removeItem(RETURN_URL_KEY);
    loggedIn = true;
    guard = new AuthGuard({ isLoggedIn: () => of(loggedIn) } as any, router);
  });

  it('lets an authenticated user through', (done) => {
    guard.canActivate({} as any, { url: '/task?task=t1' } as any).subscribe(result => {
      expect(result).toBeTrue();
      expect(sessionStorage.getItem(RETURN_URL_KEY)).toBeNull();
      done();
    });
  });

  it('remembers the requested link and sends to the login', (done) => {
    loggedIn = false;
    guard.canActivateChild({} as any, { url: '/task?task=t1&ssid=s1' } as any).subscribe((result: any) => {
      expect(result.redirectedTo).toBe('/signin');
      expect(sessionStorage.getItem(RETURN_URL_KEY)).toBe('/task?task=t1&ssid=s1');
      done();
    });
  });

  it('returns to the saved internal link only once', () => {
    sessionStorage.setItem(RETURN_URL_KEY, '/invoicing/invoice/i1/view?ssid=s1');
    expect(consumeReturnUrl()).toBe('/invoicing/invoice/i1/view?ssid=s1');
    expect(consumeReturnUrl()).toBe('/dashboard');
  });

  it('rejects external or looping return links', () => {
    for (const unsafe of ['https://evil.test', '//evil.test', 'task', '/signin']) {
      sessionStorage.setItem(RETURN_URL_KEY, unsafe);
      expect(consumeReturnUrl()).toBe('/dashboard');
    }
  });
});
