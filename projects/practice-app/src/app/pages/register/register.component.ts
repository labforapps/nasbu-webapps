import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingTokenizationSessionResult, Plan, PlanFeature, Subscription, UserSignupPayload } from 'core-models';
import { Observable, shareReplay, take, tap, Subscription as SubscriptionRxjs } from 'rxjs';
import { PlaceToPayStatus } from '../../common';
import { AuthService } from '../../services/auth/auth.service';
import { CheckoutModeService } from '../../services/checkout/checkout-mode.service';
import { OnboardingService } from '../../services/onboarding/onboarding.service';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const phoneRegex = /^\+\d{10,15}$/;
declare var P: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public formSubscription!: SubscriptionRxjs;
  public signupForm!: FormGroup;
  public plans$!: Observable<Plan[]>;
  public plans!: Plan[];
  public selectedPlan!: Plan;
  public anualSubscription!: boolean;
  public errorMessage!: string;
  public matchMessage: string = '';
  public passwordMatchMsg: string = '';
  public passwordDontMatchMsg: string = '';
  // null es el campo vacio mientras se edita; usersCount se encarga de traducirlo.
  public totalUsers: number | null = 1;
  public phoneNumberField!:string;
  public selectedPlanUuid!: string;
  public processingCheckout: boolean = false;

  constructor(
    private onboardingService: OnboardingService,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private checkoutMode: CheckoutModeService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // El retorno de PlaceToPay cae en esta misma ruta, asi que hay que atenderlo
    // antes de armar el formulario. No va dentro de applyQueryParams() porque ese
    // corre recien cuando resuelve el GET de planes, y esto no depende de eso.
    if (this.handleCheckoutReturn()) {
      return;
    }

    this.buildForm();
    this.loadPlans();
    this.formChange();
    this.loadTranslatedWords();
    this.applyQueryParams();
  }

  handleCheckoutReturn(): boolean {
    const params = this.activatedRoute.snapshot.queryParams;
    const subscriptionId = params['subscription_id'];

    if (!subscriptionId) {
      return false;
    }

    this.processingCheckout = true;

    if (params['cancelled'] === 'true') {
      this.onboardingService
          .cancelOnboardingTokenization(subscriptionId)
          .subscribe(() => this.restartSignup(), () => this.restartSignup());

      return true;
    }

    this.onboardingService
        .confirmOnboardingTokenization(subscriptionId)
        .subscribe(
          () => this.navigateToLogin(),
          () => {
            this.processingCheckout = false;
            this.errorMessage = 'checkoutFailed';
          });

    return true;
  }

  restartSignup(): void {
    // La suscripcion quedo cancelada y el usuario borrado de Cognito: se vuelve al
    // formulario limpio, sin los query params del retorno.
    this.router
        .navigate(['/signup'], { queryParams: {} })
        .then(() => window.location.reload());
  }

  get selectedPlanValue(): string {
    if (this.selectedPlan) {
      return this.selectedPlan.uuid.toString();
    }

    return '-1';
  }

  get freeTrialDays(): string {
    if (this.selectedPlan) {
      return this.selectedPlan.trial_total_days.toFixed(0);
    }

    return '';
  }

  /**
   * El input puede quedar vacio mientras el usuario tipea (ngModel escribe null) o con
   * un valor invalido. Todo lo que consume la cantidad pasa por aca, asi nadie tiene
   * que confiar en lo que hay en el modelo en ese instante.
   */
  get usersCount(): number {
    const parsed = Math.floor(Number(this.totalUsers));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }

  // Ojo: el template interpola este getter, asi que corre en cada ciclo de change
  // detection y tiene que ser puro. Antes normalizaba this.totalUsers aca adentro, y
  // como ese campo esta enlazado con [(ngModel)], el campo vacio lo dejaba alternando
  // entre 0 y -0 ciclo a ciclo: Object.is los ve distintos y la pestaña se frizaba.
  get planTotalPrice(): string {
    if (!this.selectedPlan) {
      return '';
    }

    const price = +this.selectedPlan.price;
    const basePrice = this.anualSubscription
      ? price * 12 * (1 - +this.selectedPlan.anual_discount_pct / 100)
      : price;

    return (basePrice * this.usersCount).toFixed(2);
  }

  /**
   * El minimo es 1: cualquier numero por debajo se sube al toque, en el mismo tecleo.
   *
   * El campo vacio es la unica excepcion, porque es un estado de transito al reemplazar
   * el valor (seleccionar y tipear, o borrar con backspace): forzarlo a 1 ahi le pisaria
   * al usuario lo que esta escribiendo. Ese caso lo cierra el blur.
   */
  onTotalUsersChange(value: number | null): void {
    if (value === null || value === undefined || Number.isNaN(value)) {
      this.totalUsers = null;
      return;
    }

    this.totalUsers = Math.max(1, Math.floor(value));
  }

  normalizeTotalUsers(): void {
    this.totalUsers = this.usersCount;
  }

  get subscriptionPeriodDesc(): string {
    return this.anualSubscription ? 'register.annual' : 'register.monthly';
  }

  get isValidForm(): boolean {
    return this.signupForm.valid && !(!this.selectedPlan?.uuid) && this.passwordMatch;;
  }

  get passwordMatch(): boolean {
    return this.matchMessage === this.passwordMatchMsg;
  }

  buildForm(): void {
    this.signupForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [null, [Validators.required, Validators.pattern(phoneRegex)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(passwordRegex), Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, Validators.pattern(passwordRegex), Validators.minLength(8)]]
    });
  }

  onSelectSubscriptionPeriod(change: MatSlideToggleChange): void {
    console.log('onSelectSubscriptionPeriod: ', change);
    this.anualSubscription = change.checked;
  }

  onSelectPlan(change: MatSelectChange): void {
    console.log('Plan: ', change);
    const findedPlan = this.plans.find((p) => p.uuid === change.value);
    if (findedPlan) {
      this.selectedPlan = findedPlan;
    }
  }

  setPhoneField(value: any) {
    this.phoneNumberField = value.replace(/[\s-]/g, '');
    this.signupForm.patchValue({
      phoneNumber: this.phoneNumberField
    })
  }

  /**
   * Punto de entrada de los dos botones del formulario.
   *
   * En Safari y en moviles el lightbox no funciona (se abre en un iframe y WebKit
   * bloquea las cookies de terceros), asi que ahi se va por redirect.
   */
  startCheckout(isFreeTrial: boolean): void {
    // Los botones no estan realmente deshabilitados: el template solo les pone una
    // clase CSS, asi que el click dispara igual con el form invalido. En redirect eso
    // creaba el usuario de Cognito antes de validar nada.
    if (!this.isValidForm) {
      return;
    }

    const override = this.activatedRoute.snapshot.queryParams['checkout'];

    if (this.checkoutMode.detect(override) === 'redirect') {
      this.signupAndRedirectToCheckout(isFreeTrial);
    } else {
      this.initRequestForTokenizationSession(isFreeTrial);
    }
  }

  buildSignupPayload(isFreeTrial: boolean, requestId?: string): UserSignupPayload {
    return {
      username: this.signupForm.value.email,
      password: this.signupForm.value.password,
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      phoneNumber: this.phoneNumberField,
      email: this.signupForm.value.email,
      subscriptionInfo: {
        plan: this.selectedPlan.uuid,
        period: this.anualSubscription ? 'Y' : 'M',
        free_trial: isFreeTrial,
        total_users: this.usersCount,
        // Sin requestId la clave queda fuera del payload, y el backend entiende que
        // tiene que armar la sesion de tokenizacion (modo redirect).
        ...(requestId ? { pm_request_id: requestId } : {})
      }
    };
  }

  signupAndCreateSubscription(isFreeTrial: boolean, requestId: string): void {
    const { password, confirmPassword } = this.signupForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'passwordsDoNotMatch';
      return;
    }

    this.onboardingService
      .createUserAndAccount(this.buildSignupPayload(isFreeTrial, requestId))
      .subscribe((subscription: Subscription) => {
          this.navigateToLogin();
      }, (error: any) => {
        this.errorMessage = (error.name == 'InvalidParameterException') ? error.message : error.name;
      });
  }

  /**
   * Modo redirect: se invierte el orden respecto del lightbox. Primero se crean el
   * usuario y la suscripcion, y recien despues se tokeniza la tarjeta en PlaceToPay.
   */
  signupAndRedirectToCheckout(isFreeTrial: boolean): void {
    const { password, confirmPassword } = this.signupForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'passwordsDoNotMatch';
      return;
    }

    this.processingCheckout = true;

    this.onboardingService
      .createUserAndAccount(this.buildSignupPayload(isFreeTrial))
      .subscribe((subscription: Subscription) => {
          if (subscription.first_checkout_url) {
            window.location.href = subscription.first_checkout_url;
            return;
          }

          // Sin URL de checkout no hay nada que tokenizar.
          this.navigateToLogin();
      }, (error: any) => {
        this.processingCheckout = false;
        this.errorMessage = (error.name == 'InvalidParameterException') ? error.message : error.name;
      });
  }

  /**
   * Referencia que va a PlaceToPay. En modo lightbox la suscripcion todavia no
   * existe, asi que no hay un id real: al menos tiene que ser unica por intento
   * (antes iba un literal fijo, compartido por todas las altas).
   *
   * PlaceToPay exige entre 1 y 32 caracteres: un UUID canonico (36) lo rechaza con
   * "Invalid reference", asi que va sin guiones. randomUUID ademas no existe en
   * Safari < 15.4, de ahi el fallback.
   */
  buildTokenizationReference(): string {
    const raw = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}${Math.random().toString(36).slice(2, 10)}`;

    return raw.slice(0, 32);
  }

  initRequestForTokenizationSession(isFreeTrial: boolean) {
        this.onboardingService
            .generateNewTokenizationSession(this.buildTokenizationReference())
            .subscribe((result: OnboardingTokenizationSessionResult) => {
                  if (result.status && result.status['status'].toLowerCase() == 'ok') {
                      this.initPaymentModal(result.processUrl, isFreeTrial);
                  }
            });
  }

  initPaymentModal(processUrl: string, isFreeTrial: boolean): void {
    P.init(processUrl);
    P.on('response', (response: OnboardingTokenizationSessionResult) => {
        console.log('PM Response: ', response);
        if (response.status && response.status['status'].toLowerCase() == 'approved') {
          this.signupAndCreateSubscription(isFreeTrial, response.requestId);
        }
    });
  }

  enterIntoApp(username: string, password: string): void {
    this.authService.signIn(username, password).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  navigateToLogin() {
      this.router.navigate(['/signin'],{
        queryParams: {
          firstLogin: true
        }
      });
  }

  formChange(): void {
    this.formSubscription = this.signupForm.valueChanges.subscribe(({ password, confirmPassword }: any) => {
      this.errorMessage = '';
      const passwordToched = this.signupForm.get('password')?.touched;
      const confirmPasswordTouched = this.signupForm.get('confirmPassword')?.touched;

      if (!passwordToched && !confirmPasswordTouched) return;
      if (!password && !confirmPassword) {
        this.matchMessage = this.passwordDontMatchMsg;
        return;
      }
      this.matchMessage = (password === confirmPassword) ? this.passwordMatchMsg : this.passwordDontMatchMsg;
    });
  }

  loadPlans(): void {
    this.plans$ = this.onboardingService
      .getPlans()
      .pipe(
        tap((plans: Plan[]) => {
          this.plans = plans;
        }),
        shareReplay(1)
      );
  }

  applyQueryParams(): void {
    this.plans$.pipe(take(1)).subscribe(() => {
      const params = this.activatedRoute.snapshot.queryParams;
      if (params['plan']) {
        const found = this.plans.find(p => p.uuid === params['plan']);
        if (found) {
          this.selectedPlan = found;
          this.selectedPlanUuid = found.uuid;
        }
      }
      if (params['period'] === 'Y') {
        this.anualSubscription = true;
      }
    });
  }

  loadTranslatedWords(): void {
    this.translate.get(
      ['recovery.passwordsMatch', 'errorMessages.passwordsDoNotMatch'],)
      .pipe(take(1)).subscribe((res: any) => {
        this.passwordMatchMsg = res['recovery.passwordsMatch'];
        this.passwordDontMatchMsg = res['errorMessages.passwordsDoNotMatch'];
      });
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  getPlanFeatures(features: PlanFeature[]): PlanFeature[] {
    return features.filter((feature: PlanFeature) => feature.show_in_public_pricing);
  }

  getPlanFeatureDescription(feature: PlanFeature): string {
    // "features": [
    //         {
    //             "uuid": "efce4398-8fa5-41df-a714-32312b8ebb38",
    //             "feature": {
    //                 "uuid": "8f6f8bfc-d97b-4eaa-9c02-df833c7db18b",
    //                 "type": "quantity",
    //                 "code": "users",
    //                 "name": "Users",
    //                 "description": "Users",
    //                 "price": "10.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 20,
    //             "price": "10.00"
    //         },
    //         {
    //             "uuid": "b6a0066c-2a2d-4bb7-9c6c-bdda32fe48c9",
    //             "feature": {
    //                 "uuid": "d546ea26-b295-49f6-bcaf-c1b5662c1d24",
    //                 "type": "quantity",
    //                 "code": "files",
    //                 "name": "Files",
    //                 "description": "Files",
    //                 "price": "10.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 10,
    //             "price": "10.00"
    //         },
    //         {
    //             "uuid": "99b26054-0f24-4e50-86e0-47f7a972f8f1",
    //             "feature": {
    //                 "uuid": "c77ab776-da24-4417-81db-f983d1076b35",
    //                 "type": "quantity",
    //                 "code": "matters",
    //                 "name": "Matters",
    //                 "description": "Matters",
    //                 "price": "10.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 10,
    //             "price": "10.00"
    //         },
    //         {
    //             "uuid": "9112ae7b-6c13-4c3e-87c2-74bba3c7f3a5",
    //             "feature": {
    //                 "uuid": "f4e01a78-663a-4313-8f1b-ac395a9162f7",
    //                 "type": "quantity",
    //                 "code": "docs",
    //                 "name": "Documents",
    //                 "description": "Documents",
    //                 "price": "10.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 10,
    //             "price": "10.00"
    //         },
    //         {
    //             "uuid": "559a03ea-696c-4a10-b303-8449c4c89263",
    //             "feature": {
    //                 "uuid": "a6b38de5-c4c2-414b-8c6f-c6b9127cc5eb",
    //                 "type": "quantity",
    //                 "code": "case_files",
    //                 "name": "Case Files",
    //                 "description": "Case Files",
    //                 "price": "0.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 25,
    //             "price": "0.00"
    //         },
    //         {
    //             "uuid": "efa36348-1241-4942-bb0f-8062360cd32a",
    //             "feature": {
    //                 "uuid": "71c034be-9afa-41eb-9a00-dbc3bc9c94d4",
    //                 "type": "quantity",
    //                 "code": "customers",
    //                 "name": "Customers",
    //                 "description": "Customers",
    //                 "price": "10.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 9999999,
    //             "price": "0.00"
    //         },
    //         {
    //             "uuid": "f87172c1-cf5c-4bb2-887c-90fe66f47bb7",
    //             "feature": {
    //                 "uuid": "42e973f1-c696-40ef-b1ea-6c5b463b9edd",
    //                 "type": "quantity",
    //                 "code": "storage",
    //                 "name": "Storage",
    //                 "description": "Storage",
    //                 "price": "0.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 1000000000,
    //             "price": "0.00"
    //         },
    //         {
    //             "uuid": "92d21d7d-6734-449e-a105-1577b7f1376a",
    //             "feature": {
    //                 "uuid": "8a89719c-a7b2-4144-b147-b711a083b15a",
    //                 "type": "quantity",
    //                 "code": "tasks",
    //                 "name": "Tareas",
    //                 "description": "Tareas",
    //                 "price": "0.00",
    //                 "monthly_ussage": false
    //             },
    //             "quantity": 10000000,
    //             "price": "0.00"
    //         },
    //         {
    //             "uuid": "3b44a1e9-7821-429a-80c9-ebbebd166fa9",
    //             "feature": {
    //                 "uuid": "025b2afc-e190-4327-ad35-1ab6c2861efc",
    //                 "type": "quantity",
    //                 "code": "signature_requests",
    //                 "name": "Signature Requests",
    //                 "description": "Signature Requests",
    //                 "price": "0.00",
    //                 "monthly_ussage": true
    //             },
    //             "quantity": 10,
    //             "price": "0.00"
    //         }
    //     ]
    let featureDescription: string = '';
    switch (feature.feature.code) {
      case 'storage':
        featureDescription = `Almacenamiento en la nube (hasta ${feature.quantity/1024} GB).`;
        break;
      case 'signature_requests':
        featureDescription = `Gestión de Firma Electrónica (hasta ${feature.quantity} firmas mensuales).`;
        break;
      case 'docs':
          featureDescription = 'Módulo de documentos y plantillas';
          break;
      default:
        featureDescription = '';
        break;
    }
    return featureDescription;
  }
}
