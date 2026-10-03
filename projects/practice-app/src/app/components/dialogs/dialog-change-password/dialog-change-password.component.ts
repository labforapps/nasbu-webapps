import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SecurityService } from 'core-services';
import { AuthService } from '../../../services/auth/auth.service';

// Mismas reglas que la contrasena inicial (sign-in-first-password).
const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

/** Errores de Cognito con mensaje propio; el resto muestra uno generico. */
const COGNITO_ERRORS: { [code: string]: string } = {
  NotAuthorizedException: 'wrongCurrentPassword',
  InvalidPasswordException: 'invalidPassword',
  LimitExceededException: 'tooManyAttempts'
};

function passwordsValidator(form: AbstractControl): ValidationErrors | null {
  const { currentPassword, newPassword, confirmPassword } = form.value;
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { mismatch: true };
  }
  if (newPassword && currentPassword && newPassword === currentPassword) {
    return { sameAsCurrent: true };
  }
  return null;
}

/**
 * Cambio de contrasena con sesion iniciada. Despues de cambiarla en Cognito avisa al
 * backend, que genera la notificacion "Cambio importante en tu cuenta".
 */
@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.scss']
})
export class DialogChangePasswordComponent implements OnDestroy {

  readonly form: FormGroup;
  saving = false;
  errorKey = '';
  private requests = new Subscription();

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private securityService: SecurityService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private dialogRef: MatDialogRef<DialogChangePasswordComponent>) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(passwordRegex), Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsValidator });
  }

  ngOnDestroy(): void {
    this.requests.unsubscribe();
  }

  save(): void {
    if (this.form.invalid || this.saving) {
      return;
    }
    const { currentPassword, newPassword } = this.form.value;
    this.saving = true;
    this.errorKey = '';
    this.requests.add(this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => this.onPasswordChanged(),
      error: (error: any) => {
        this.saving = false;
        this.errorKey = COGNITO_ERRORS[error?.code || error?.name] || 'generic';
      }
    }));
  }

  private onPasswordChanged(): void {
    const subscriptionId = this.authService.getUserInfoFromLocalStorage()?.ssid?.uuid;
    if (subscriptionId) {
      // La contrasena ya cambio: si el aviso falla no se bloquea al usuario.
      this.requests.add(this.securityService.reportAccountEvent(subscriptionId, 'password_changed')
        .subscribe({ error: () => undefined }));
    }
    this.saving = false;
    this.toastr.success(this.translate.instant('changePassword.success'));
    this.dialogRef.close(true);
  }
}
