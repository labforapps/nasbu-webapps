import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { Plan, Subscription, UserSignupPayload } from 'core-models';
import { Observable, tap } from 'rxjs';
import { SignupService } from '../../services/auth/signup.service';
import { OnboardingService } from '../../services/onboarding/onboarding.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm!: FormGroup;

  plans$!: Observable<Plan[]>;
  plans!: Plan[];
  selectedPlan!: Plan;

  anualSubscription!: boolean;

  constructor(private onboardingService: OnboardingService,
              private router: Router) { }

  ngOnInit(): void {
      this.plans$ = this.onboardingService
          .getPlans()
          .pipe(
              tap((plans: Plan[]) => {
                  this.plans = plans;
              })
          );
      this.initSignupForm();
  }

  initSignupForm() {
      this.signupForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            phoneNumber: new FormControl(null, Validators.required),
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required),
            confirmPassword: new FormControl(null, Validators.required)
      });
  }

  onSelectSubscriptionPeriod(change: MatSlideToggleChange) {
      console.log('onSelectSubscriptionPeriod: ', change);
      this.anualSubscription = change.checked;
  }

  onSelectPlan(change: MatSelectChange) {
      console.log('Plan: ', change);
      const findedPlan = this.plans.find((p) => p.uuid === change.value);
      if (findedPlan) {
          this.selectedPlan = findedPlan;
      }
  }

  onSelectPlan2() {
    console.log('Plan: ');
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
      if (this.anualSubscription) {
          return 'Anual';
      }

      return 'Mensual';
  }

  get isValidForm(): boolean {
      return this.signupForm.valid;
  }

  signupAndCreateSubscription(isFreeTrial: boolean) {
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
          });
  }

}
