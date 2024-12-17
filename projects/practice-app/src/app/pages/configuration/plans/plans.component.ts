import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../../services/onboarding/onboarding.service';
import { ChangePlanRequest, Feature, Plan, PlanFeature, Subscription } from 'core-models';
import { AuthService, SubscriptionService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  plans!:Plan[];
  subscription!:Subscription;
  selectedSubscription!:any;
  anualPlan:boolean = false;
  planSelected!:Plan | undefined;

  features!: Feature[];

  constructor(private onboardingService:OnboardingService,
              private subscriptionService:SubscriptionService,
              private authService: AuthService,
              private helperService:HelpersService
  ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.fetchFeatures();
  }

  getPlans(){
    this.onboardingService.getPlans().subscribe({
      next: (data) => {
        this.plans = data
        this.getSubscriptionInformation();
      }
    })
  }

  fetchFeatures(){
      this.onboardingService
          .getFeatures()
          .subscribe((features: Feature[]) => {
              this.features = features;
              this.getPlans();
          })
  }

  getSubscriptionInformation(){
    this.subscriptionService.getSubscription(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.subscription = data;
      this.planSelected = this.plans.find(x => x.uuid === this.subscription.plan)
    })
  }

  getPlanPricing(plan:Plan){

    if(this.anualPlan){
      return  +(+plan.price - (+plan.price * (+plan.anual_discount_pct / 100)))
    }
    else{
      return plan.price
    }

  }

  changePlanRequest(plan:Plan){

    this.helperService.showConfirmationChangePlan().then(data => {

      const payload:ChangePlanRequest = {
        subscription: this.subscription.uuid,
        period:       plan.uuid,
        to_plan:      "M"
      }

      this.subscriptionService.subscriptionChangePlanRequest(payload).subscribe({
        next: (data) => {
          this.helperService.showCustomMessage('Ok',"OK","Plan Cambiado")
          this.getSubscriptionInformation()
        }
      })

    })
  }

  getFeatureInPlan(plan: Plan, feature: Feature): PlanFeature | undefined {
    return plan.features.find((f) => f.feature.code === feature.code);
  }

  getFeatureComercialDescription(feature: Feature): string {
      // USERS = 'users'
      // CUSTOMERS = 'customers'
      // FILES = 'files'
      // CASE_FILES = 'case_files'
      // MATTERS = 'matters'
      // TASKS = 'tasks'
      // DOCUMENTS = 'docs'
      // STORAGE = 'storage'
      // SMS_NOTIFICATIONS = 'sms_notifications'
      // EMAIL_NOTIFICATIONS = 'email_notifications'

      let comercialDescription: string = '';
      switch (feature.code.toLowerCase()) {
        case 'users':
            comercialDescription = 'Usuarios';
          break;
        case 'users':

          break;
        case 'case_files':

          break;
        case 'tasks':

          break;
        case 'docs':

          break;
        case 'storage':

          break;
        case 'sms_notifications':

          break;
        case 'emails_notifications':

          break;

        default:
          break;
      }

      return comercialDescription;
  }

  getFeatureInPlanDescription(plan: Plan, feature: Feature): string {
      const planFeature: PlanFeature | undefined = this.getFeatureInPlan(plan, feature);
      if (planFeature) {
          return this.getFeatureComercialDescription(planFeature.feature);
      }

      return this.getFeatureComercialDescription(feature);
  }

}
