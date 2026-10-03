import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { ResumeTokenizationResult } from 'core-models';
import { AuthService } from './auth.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { CheckoutRedirectService } from '../checkout/checkout-redirect.service';

/**
 * Impide entrar a la app con un alta que no completo el pago.
 *
 * En el registro por redirect (Safari, moviles) la cuenta de Cognito se confirma antes de
 * tokenizar la tarjeta: el mail de verificacion sale en el signup y el pago ocurre
 * despues. Quien abandonaba PlaceToPay y confirmaba igual quedaba con una cuenta
 * plenamente usable y sin metodo de pago.
 *
 * El backend ya rechaza esas suscripciones (403 en toda la API); este guard evita que el
 * usuario llegue a una pantalla rota y lo manda de vuelta al checkout.
 */
@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(private authService: AuthService,
              private onboardingService: OnboardingService,
              private checkoutRedirect: CheckoutRedirectService,
              private router: Router) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    return this.allowNavigation();
  }

  canActivateChild(_childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    return this.allowNavigation();
  }

  canDeactivate(
    _component: unknown,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    _nextState?: RouterStateSnapshot): boolean {
    return true;
  }

  canLoad(_route: Route, _segments: UrlSegment[]): boolean {
    return this.allowNavigation();
  }

  private allowNavigation(): boolean {
    const pending = this.authService.getPendingPaymentSubscription();

    if (!pending) {
      return true;
    }

    this.sendToCheckout(pending.ssid?.uuid ?? pending.ssid);
    return false;
  }

  /**
   * Se pide una sesion nueva en vez de reutilizar la URL guardada: la de PlaceToPay
   * vence a los 30 minutos y para cuando el usuario vuelve casi siempre esta muerta.
   */
  private sendToCheckout(subscriptionId: string): void {
    if (!subscriptionId) {
      this.router.navigate(['/signin']);
      return;
    }

    this.onboardingService
        .resumeOnboardingTokenization(subscriptionId)
        .subscribe((result: ResumeTokenizationResult) => {
            this.checkoutRedirect.goTo(result.checkout_url);
        }, () => {
            // El alta ya no se puede retomar (el barrido la dio de baja, o la sesion
            // fallo): no queda mas que volver al login.
            this.router.navigate(['/signin']);
        });
  }
}
