import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';

/**
 * El login es la ultima barrera antes de entrar a la app: si el alta confirmo la cuenta
 * en Cognito pero nunca completo el pago (registro por redirect), en vez de ir al
 * dashboard hay que devolver al usuario al checkout de PlaceToPay.
 *
 * Se instancia el componente a mano en lugar de armar un TestBed: solo interesa la
 * logica de `signIn`, no la plantilla ni el arbol de dependencias de Angular Material.
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<any>;
  let onboardingService: jasmine.SpyObj<any>;
  let checkoutRedirect: jasmine.SpyObj<any>;
  let router: jasmine.SpyObj<any>;
  let dialog: jasmine.SpyObj<any>;

  const pendingSubscription = {
    ssid: { uuid: 'sub-123' },
    mt: 'O',
    permissions: [],
    status: 'Z'
  };

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['signIn', 'getPendingPaymentSubscription']);
    onboardingService = jasmine.createSpyObj('OnboardingService', ['resumeOnboardingTokenization']);
    checkoutRedirect = jasmine.createSpyObj('CheckoutRedirectService', ['goTo']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    // La navegacion al dashboard encadena un `window.location.reload()`. Con una promesa
    // que nunca se resuelve el `.then` no llega a correr y Karma no se cae por una
    // recarga real de la pagina; lo que interesa medir es a donde se navega.
    router.navigate.and.returnValue(new Promise(() => {}));

    const activatedRoute = { snapshot: { queryParams: {} } } as any;

    component = new LoginComponent(dialog, authService, onboardingService,
                                   checkoutRedirect, new FormBuilder(), router,
                                   activatedRoute);
    component.buildForm();
    component.signinForm.setValue({ username: 'owner@nasbu.test', password: 'secreto' });

    authService.signIn.and.returnValue(of({ uuid: 'user-1', subscriptions: [] }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('entra al dashboard cuando el alta esta paga', () => {
    authService.getPendingPaymentSubscription.and.returnValue(null);

    component.signIn();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(onboardingService.resumeOnboardingTokenization).not.toHaveBeenCalled();
  });

  it('no entra al dashboard cuando el pago quedo pendiente', () => {
    authService.getPendingPaymentSubscription.and.returnValue(pendingSubscription);
    onboardingService.resumeOnboardingTokenization.and.returnValue(
      of({ subscription_id: 'sub-123', checkout_url: 'https://ptp.test/nueva' }));

    component.signIn();

    expect(router.navigate).not.toHaveBeenCalledWith(['/dashboard']);
  });

  it('manda al checkout con una sesion nueva cuando el pago quedo pendiente', () => {
    authService.getPendingPaymentSubscription.and.returnValue(pendingSubscription);
    onboardingService.resumeOnboardingTokenization.and.returnValue(
      of({ subscription_id: 'sub-123', checkout_url: 'https://ptp.test/nueva' }));

    component.signIn();

    expect(onboardingService.resumeOnboardingTokenization).toHaveBeenCalledWith('sub-123');
    expect(checkoutRedirect.goTo).toHaveBeenCalledWith('https://ptp.test/nueva');
  });

  it('avisa cuando el alta ya no se puede retomar', () => {
    authService.getPendingPaymentSubscription.and.returnValue(pendingSubscription);
    onboardingService.resumeOnboardingTokenization.and.returnValue(
      throwError(() => new Error('expirada')));

    component.signIn();

    expect(checkoutRedirect.goTo).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('pendingPaymentSubscription');
  });
});
