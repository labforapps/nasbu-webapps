import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogRecoveryComponent } from '../../components/dialogs/dialog-recovery/dialog-recovery.component';
import { AuthService } from '../../services/auth/auth.service';
import { OnboardingService } from '../../services/onboarding/onboarding.service';
import { CheckoutRedirectService } from '../../services/checkout/checkout-redirect.service';
import { ErrorCodes, ResumeTokenizationResult, UserInfo } from 'core-models';
import { consumeReturnUrl } from 'core-services';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { DialogNewSubscriptionComponent } from '../../components/dialogs/dialog-new-subscription/dialog-new-subscription.component';
import { DialogSendAccountConfirmationComponent } from '../../components/dialogs/dialog-send-account-confirmation/dialog-send-account-confirmation.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public formSubscription!: Subscription;
  public signinForm!: FormGroup;
  public errorMessage!: string;
  public currentFocus: string = 'username';
  public focusEmailField: boolean = false;
  @ViewChild('campoFoco') campoFoco!: ElementRef;


  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private onboardingService: OnboardingService,
              private checkoutRedirect: CheckoutRedirectService,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute:ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.formChange();

    const firstLogin =  this.activatedRoute.snapshot.queryParams['firstLogin'];

    if(firstLogin) {
      const dialofRef = this.dialog.open(DialogNewSubscriptionComponent);

      dialofRef.afterClosed().subscribe(data => {
        this.campoFoco.nativeElement.focus();
      })
    }
  }

  buildForm(): void {
    this.signinForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  formChange(): void {
    this.formSubscription = this.signinForm.valueChanges.subscribe(() => this.errorMessage = '');
  }

  openDialogRecovery(): void {
    const dialogRef = this.dialog.open(DialogRecoveryComponent);
  }

  signIn(): void {
    const { username, password } = this.signinForm.value;
    this.authService
      .signIn(username, password)
      .subscribe((data: UserInfo | CognitoUser) => {

        if(data instanceof CognitoUser){
          const state =  {
            firstPasswordUsername: username,
            currentPassword: password
          };

          this.router.navigate(['/signin-first-password'],{state});
        }
        else{

          // El alta por redirect confirma la cuenta en Cognito antes de tokenizar la
          // tarjeta, asi que se puede llegar hasta aca sin haber pagado. En ese caso no
          // se entra a la app: se vuelve al checkout.
          if (this.authService.getPendingPaymentSubscription()) {
            this.resumePendingCheckout();
            return;
          }

          if(!localStorage.getItem(`first_login_${username}`)){
            localStorage.setItem(`first_login_${username}`,'true')
          }

          // Si se llego al login desde un enlace (p. ej. un email de notificacion), se
          // vuelve a esa pantalla; si no, al dashboard.
          this.router.navigateByUrl(consumeReturnUrl()).then(() => {
            window.location.reload();
          });
        }

      }, (error) => {

        if(error.code === ErrorCodes.UserNotConfirmedException) {
          this.openDialogSendConfirmationEmail(username)
          return;
        }

        this.errorMessage = error.message;
      });
  }

  /**
   * Manda al usuario de vuelta a PlaceToPay para terminar el alta que dejo a medias.
   *
   * Se pide una sesion nueva en lugar de reusar la URL guardada: la de PlaceToPay vence
   * a los 30 minutos y para cuando el usuario vuelve casi siempre esta muerta.
   */
  resumePendingCheckout(): void {
    const pending = this.authService.getPendingPaymentSubscription();
    const subscriptionId = pending?.ssid?.uuid ?? pending?.ssid;

    if (!subscriptionId) {
      this.errorMessage = 'pendingPaymentSubscription';
      return;
    }

    this.onboardingService
        .resumeOnboardingTokenization(subscriptionId)
        .subscribe((result: ResumeTokenizationResult) => {
            this.checkoutRedirect.goTo(result.checkout_url);
        }, () => {
            // El alta ya no se puede retomar: el barrido de altas abandonadas la dio de
            // baja, o PlaceToPay rechazo la sesion nueva.
            this.errorMessage = 'pendingPaymentSubscription';
        });
  }

  openDialogSendConfirmationEmail(username:string) {

    this.dialog.open(DialogSendAccountConfirmationComponent, {
      data: {
        username
      }
    })

  }

  changeFocus(focusField: string): void {
    this.currentFocus = focusField;
  }

  gotoSignup(): void {
    this.router.navigate(['/signup']);
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

}
