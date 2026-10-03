import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SubscriptionGuard } from './subscription.guard';
import { AuthService } from './auth.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { CheckoutRedirectService } from '../checkout/checkout-redirect.service';

/**
 * El guard corta el paso de un alta que confirmo la cuenta en Cognito pero nunca
 * completo el pago (registro por redirect: el mail de verificacion sale antes de
 * tokenizar la tarjeta).
 */
describe('SubscriptionGuard', () => {
  let guard: SubscriptionGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let onboardingService: jasmine.SpyObj<OnboardingService>;
  let checkoutRedirect: jasmine.SpyObj<CheckoutRedirectService>;
  let router: jasmine.SpyObj<Router>;

  const pendingSubscription = {
    ssid: { uuid: 'sub-123' },
    mt: 'O',
    permissions: [],
    status: 'Z',
    checkoutUrl: 'https://ptp.test/vencida'
  } as any;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getPendingPaymentSubscription']);
    onboardingService = jasmine.createSpyObj('OnboardingService', ['resumeOnboardingTokenization']);
    checkoutRedirect = jasmine.createSpyObj('CheckoutRedirectService', ['goTo']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        SubscriptionGuard,
        { provide: AuthService, useValue: authService },
        { provide: OnboardingService, useValue: onboardingService },
        { provide: CheckoutRedirectService, useValue: checkoutRedirect },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(SubscriptionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('deja pasar cuando el alta esta paga', () => {
    authService.getPendingPaymentSubscription.and.returnValue(null);

    expect(guard.canActivate({} as any, {} as any)).toBeTrue();
    expect(onboardingService.resumeOnboardingTokenization).not.toHaveBeenCalled();
  });

  it('bloquea cuando el pago quedo pendiente', () => {
    authService.getPendingPaymentSubscription.and.returnValue(pendingSubscription);
    onboardingService.resumeOnboardingTokenization.and.returnValue(
      of({ subscription_id: 'sub-123', checkout_url: 'https://ptp.test/nueva' }));

    expect(guard.canActivate({} as any, {} as any)).toBeFalse();
  });

  it('pide una sesion de checkout nueva en vez de reusar la URL vencida', () => {
    authService.getPendingPaymentSubscription.and.returnValue(pendingSubscription);
    onboardingService.resumeOnboardingTokenization.and.returnValue(
      of({ subscription_id: 'sub-123', checkout_url: 'https://ptp.test/nueva' }));

    guard.canActivate({} as any, {} as any);

    expect(onboardingService.resumeOnboardingTokenization).toHaveBeenCalledWith('sub-123');
    expect(checkoutRedirect.goTo).toHaveBeenCalledWith('https://ptp.test/nueva');
  });

  it('vuelve al login si el alta ya no se puede retomar', () => {
    authService.getPendingPaymentSubscription.and.returnValue(pendingSubscription);
    onboardingService.resumeOnboardingTokenization.and.returnValue(
      throwError(() => new Error('expirada')));

    guard.canActivate({} as any, {} as any);

    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });

  it('bloquea tambien las rutas hijas y las cargas diferidas', () => {
    authService.getPendingPaymentSubscription.and.returnValue(pendingSubscription);
    onboardingService.resumeOnboardingTokenization.and.returnValue(
      of({ subscription_id: 'sub-123', checkout_url: 'https://ptp.test/nueva' }));

    expect(guard.canActivateChild({} as any, {} as any)).toBeFalse();
    expect(guard.canLoad({} as any, [])).toBeFalse();
  });
});
