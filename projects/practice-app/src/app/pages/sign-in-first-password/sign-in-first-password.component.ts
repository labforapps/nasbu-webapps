import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, switchMap, take } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { ChangeFirstPasswordPayload } from 'core-models';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

@Component({
  selector: 'app-sign-in-first-password',
  templateUrl: './sign-in-first-password.component.html',
  styleUrls: ['./sign-in-first-password.component.scss']
})
export class SignInFirstPasswordComponent implements OnInit {

  public formSubscription!: Subscription;
  public recoveryForm!: FormGroup;
  public matchMessage: string = '';
  public passwordMatchMsg: string = '';
  public passwordDontMatchMsg: string = '';
  public recoveryCode!: string;
  public errorMessage!: string;
  public recoveryEmail!: string;
  private firstPasswordUsername!:string;

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
     this.validatefirstPasswordUsername();
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
      currentPassword: [null,Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(passwordRegex), Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
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

    const username: string = this.firstPasswordUsername;
    const password: string = window.history.state.currentPassword;
    this.authService
        .signIn(username, password)
        .pipe(
            switchMap((user) => {

              user.challengeParam.userAttributes.address = 'test';

              const payload: ChangeFirstPasswordPayload = {
                user,
                oldPassword: password,
                newPassword: this.recoveryForm.value.newPassword
              };

              return this.authService
                  .saveFirstUserPassword(payload);
          })
        ).subscribe((response) => {
            this.router.navigate(['/signin']);
          }, (error) => {
            console.log('Error: ', error);
        })
  }

  loadTranslatedWords(): void {
    this.translate.get(
      ['recovery.passwordsMatch', 'errorMessages.passwordsDoNotMatch'],)
      .pipe(take(1)).subscribe((res: any) => {
        this.passwordMatchMsg = res['recovery.passwordsMatch'];
        this.passwordDontMatchMsg = res['errorMessages.passwordsDoNotMatch'];
      });
  }

  validatefirstPasswordUsername(): void {
    if(!window.history.state.firstPasswordUsername){
      this.router.navigate(['/signin']);
      return;
    }

    this.firstPasswordUsername = window.history.state.firstPasswordUsername;
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

}
