import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Plan, UserSignupPayload } from 'core-models';
import { Observable, tap } from 'rxjs';
import { SignupService } from '../../services/auth/signup.service';

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

  constructor(private signupService: SignupService) { }

  ngOnInit(): void {
      this.plans$ = this.signupService
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
            'firstName': new FormControl(null, Validators.required),
            'lastName': new FormControl(null, Validators.required),
            'phoneNumber': new FormControl(null, Validators.required),
            'email': new FormControl(null, Validators.required),
            'password': new FormControl(null, Validators.required),
            'confirmPassword': new FormControl(null, Validators.required)
      });
  }

  onSelectSubscriptionPeriod(change: MatSlideToggleChange) {
      this.anualSubscription = change.checked;
  }

  onSelectPlan(change: MatSelectChange) {
      console.log('Plan: ', change);
      const findedPlan = this.plans.find((p) => p.id === +change.value);
      if (findedPlan) {
          this.selectedPlan = findedPlan;
      }
  }

  get selectedPlanValue(): string {
      if (this.selectedPlan) {
          return this.selectedPlan.id.toString();
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
      return this.signupForm.valid && this.selectedPlan != null;
  }

  signupAndCreateSubscription() {
      const userSignupPayload: UserSignupPayload = {
          username: this.signupForm.value.email,
          password: this.signupForm.value.password,
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          phoneNumber: this.signupForm.value.phoneNumber,
          email: this.signupForm.value.email
      };
      this.signupService
          .createUserAndAccount(userSignupPayload)
          .subscribe((payload) => {
                console.log('Payload: ', payload);
          });
  }

}
