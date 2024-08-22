import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../../services/onboarding/onboarding.service';
import { Plan, Subscription } from 'core-models';
import { AuthService, SubscriptionService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  plans!:Plan[]
  subscription!:Subscription
  selectedSubscription!:any;
  anualPlan:boolean = false
  planSelected!:Plan | undefined

  constructor(private onboardingService:OnboardingService,
              private subscriptionService:SubscriptionService,
              private authService: AuthService,
              private helperService:HelpersService
  ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getPlans()
  }

  getPlans(){
    this.onboardingService.getPlans().subscribe({
      next: (data) => {
        this.plans = data
        this.getSubscriptionInformation();
      }
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



    })


  }

}
