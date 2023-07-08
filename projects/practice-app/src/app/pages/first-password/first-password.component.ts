import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, switchMap, take } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { ChangeFirstPasswordPayload } from 'core-models';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

@Component({
  selector: 'app-first-password',
  templateUrl: './first-password.component.html',
  styleUrls: ['./first-password.component.scss']
})
export class FirstPasswordComponent implements OnInit {

  public formSubscription!: Subscription;
  public recoveryForm!: FormGroup;
  public matchMessage: string = '';
  public passwordMatchMsg: string = '';
  public passwordDontMatchMsg: string = '';
  public recoveryCode!: string;
  public errorMessage!: string;
  public recoveryEmail!: string;
  private isPasswordChanged: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.formChange();
    this.loadTranslatedWords();
    this.validateRecoveryCode();
  }

  get isValidForm(): boolean {
    return this.recoveryForm.valid && this.passwordMatch;
  }

  get validPassword(): boolean {
    return this.recoveryForm.controls['newPassword'].valid;
  }

  get passwordMatch(): boolean {
    return this.matchMessage === this.passwordMatchMsg;
  }

  buildForm(): void {
    this.recoveryForm = this.fb.group({
      newPassword: [null, [Validators.required, Validators.pattern(passwordRegex), Validators.minLength(8)]],
      confirmPassword: [null, Validators.required]
    });
  }

  formChange(): void {
    this.formSubscription = this.recoveryForm.valueChanges.subscribe(({ newPassword, confirmPassword }) => {
      if (!newPassword && !confirmPassword) {
        this.matchMessage = this.passwordDontMatchMsg;
        return;
      }
      this.matchMessage = (newPassword === confirmPassword) ? this.passwordMatchMsg : this.passwordDontMatchMsg;
    });
  }

  onSubmit(): void {
    if (this.recoveryForm.invalid) return;
    const newPassword = this.recoveryForm.value.newPassword;
    this.authService.forgotPasswordSubmit({code: this.recoveryCode, username: this.recoveryEmail, newPassword}).subscribe(
      (payload)=>{
        this.router.navigate(['/signin']);
      }, (error)=>{
        this.errorMessage = error.name;
      }
    );
  }

  loadTranslatedWords(): void {
    this.translate.get(
      ['recovery.passwordsMatch', 'errorMessages.passwordsDoNotMatch'],)
      .pipe(take(1)).subscribe((res: any) => {
        this.passwordMatchMsg = res['recovery.passwordsMatch'];
        this.passwordDontMatchMsg = res['errorMessages.passwordsDoNotMatch'];
      });
  }

  validateRecoveryCode(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const email = this.route.snapshot.queryParamMap.get('email');
    if (!code || !email) {
      this.router.navigate(['/signin']);
      return;
    }
    this.recoveryCode = code;
    this.recoveryEmail = email;
  }

  changePassword() {
    const username: string = '';
    const password: string = '';
    this.authService
        .signIn(username, password)
        .pipe(
            switchMap((user) => {
              const payload: ChangeFirstPasswordPayload = {
                user: '',
                oldPassword: '',
                newPassword: this.recoveryForm.value.newPassword
              };
              return this.authService
                  .saveFirstUserPassword(payload);
          })
        ).subscribe((response) => {
            console.log('Response: ', response);
            this.isPasswordChanged = true;
        }, (error:any) => {
            console.log('Error: ', error);
        })
}

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

}
