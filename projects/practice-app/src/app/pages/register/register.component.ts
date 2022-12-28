import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Plan, Subscription, UserSignupPayload } from 'core-models';
import { Observable, take, tap, Subscription as SubscriptionRxjs } from 'rxjs';
import { OnboardingService } from '../../services/onboarding/onboarding.service';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const phoneRegex = /^\+\d{10,15}$/;
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
  public totalUsers: number = 1;

  constructor(
    private onboardingService: OnboardingService,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadPlans();
    this.formChange();
    this.loadTranslatedWords();
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

  get planTotalPrice(): string {

    if (this.selectedPlan) {
      let totalPrice = +this.anualSubscription 
        ? +(+this.selectedPlan.price - (+this.selectedPlan.price * (+this.selectedPlan.anual_discount_pct / 100))) 
        : +this.selectedPlan.price;
      this.totalUsers =(+this.totalUsers) < 1 ? (+this.totalUsers) * -1 : +this.totalUsers
      totalPrice = totalPrice * this.totalUsers;
      return totalPrice.toFixed(2);
    }

    return '';
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
      confirmPassword: [null,[ Validators.required, Validators.pattern(passwordRegex), Validators.minLength(8)]]
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

  signupAndCreateSubscription(isFreeTrial: boolean): void {
    const { password, confirmPassword } = this.signupForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'passwordsDoNotMatch';
      return;
    }
    const userSignupPayload: UserSignupPayload = {
      username: this.signupForm.value.email,
      password: this.signupForm.value.password,
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      phoneNumber: this.signupForm.value.phoneNumber,
      email: this.signupForm.value.email,
      subscriptionInfo: {
        plan: this.selectedPlan.uuid,
        period: this.anualSubscription ? 'Y' : 'M',
        free_trial: isFreeTrial,
        total_users: +this.totalUsers,
      }
    };
    this.onboardingService
      .createUserAndAccount(userSignupPayload)
      .subscribe((subscription: Subscription) => {
        if (isFreeTrial) {
          this.router.navigate(['/signin']);
        } else {
          window.location.href = subscription.first_checkout_url;
        }
      }, (error: any) => {
        this.errorMessage = (error.name == 'InvalidParameterException') ? error.message : error.name;
      });
  }

  formChange(): void {
    this.formSubscription = this.signupForm.valueChanges.subscribe(({ password, confirmPassword }) => {
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
        })
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

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }
}
