import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { Plan, Subscription, UserSignupPayload } from 'core-models';
import { Observable, tap } from 'rxjs';
import { OnboardingService } from '../../services/onboarding/onboarding.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public signupForm!: FormGroup;
  public plans$!: Observable<Plan[]>;
  public plans!: Plan[];
  public selectedPlan!: Plan;
  public anualSubscription!: boolean;
  public errorMessage!: string;

  constructor(
    private onboardingService: OnboardingService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.plans$ = this.onboardingService
      .getPlans()
      .pipe(
        tap((plans: Plan[]) => {
          this.plans = plans;
        })
      );
    this.buildForm();
  }


  buildForm(): void {
    this.signupForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
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
      const totalPrice = +this.anualSubscription ? +(+this.selectedPlan.price - (+this.selectedPlan.price * (+this.selectedPlan.anual_discount_pct / 100))) :
        +this.selectedPlan.price;
      return totalPrice.toFixed(2);
    }

    return '';
  }

  get subscriptionPeriodDesc(): string {
    return this.anualSubscription ? 'register.annual' : 'register.monthly';
  }

  get isValidForm(): boolean { 
    return this.signupForm.valid && !(!this.selectedPlan?.uuid);
  }

  signupAndCreateSubscription(isFreeTrial: boolean): void {
    const {password, confirmPassword} = this.signupForm.value;
    if(password !== confirmPassword){
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
        free_trial: isFreeTrial
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

}
