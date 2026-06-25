import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../../services/onboarding/onboarding.service';
import { ChangePlanRequest, Plan, PlanFeature, Subscription } from 'core-models';
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

  constructor(private onboardingService:OnboardingService,
              private subscriptionService:SubscriptionService,
              private authService: AuthService,
              private helperService:HelpersService
  ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getPlans();
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
      return +(+plan.price * 12 * (1 - +plan.anual_discount_pct / 100)).toFixed(2);
    }
    else{
      return plan.price;
    }
  }

  changePlanRequest(plan:Plan){
    this.helperService.showConfirmationChangePlan().then(data => {
      if (! data.isConfirmed) {
        return;
      }
      const payload:ChangePlanRequest = {
        subscription: this.subscription.uuid,
        period:       'M',
        to_plan:      plan.uuid
      }
      this.subscriptionService.subscriptionChangePlanRequest(payload).subscribe({
        next: (data) => {
          this.helperService.showCustomMessage('Ok',"OK","Plan Cambiado")
          this.getSubscriptionInformation()
        }
      })
    })
  }

  getPlanFeatures(features: PlanFeature[]): PlanFeature[] {
    return features.filter((feature: PlanFeature) => feature.show_in_public_pricing);
  }

  getPlanFeatureDescription(feature: PlanFeature): string {
    switch (feature.feature.code) {
      case 'storage':
        return `Almacenamiento en la nube (hasta ${feature.quantity / 1024} GB).`;
      case 'signature_requests':
        return `Gestión de Firma Electrónica (hasta ${feature.quantity} firmas mensuales).`;
      case 'docs':
        return 'Módulo de documentos y plantillas';
      default:
        return '';
    }
  }

}
