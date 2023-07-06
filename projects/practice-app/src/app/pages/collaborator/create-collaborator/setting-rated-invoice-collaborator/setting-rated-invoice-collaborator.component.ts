import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SecurityUser, SubscriptionBillingFee } from 'core-models';
import { AuthService, SubscriptionService } from 'core-services';

@Component({
  selector: 'app-setting-rated-invoice-collaborator',
  templateUrl: './setting-rated-invoice-collaborator.component.html',
  styleUrls: ['./setting-rated-invoice-collaborator.component.scss']
})
export class SettingRatedInvoiceCollaboratorComponent implements OnInit {

  invoicingParameterForm!:FormGroup;
  @Input() securityUser!:SecurityUser;
  @Output() billingFeeOutput: EventEmitter<SubscriptionBillingFee> = new EventEmitter<SubscriptionBillingFee>();
  selectedSubscription!:any;
  subscriptionBillingFee!:SubscriptionBillingFee[];
  incrementOfTime!:boolean;

  constructor(private formBuilder:FormBuilder,
             private subscriptionService:SubscriptionService,
             private authService: AuthService,) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.getSubscriptionBillingFee();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['securityUser'] && changes['securityUser'].currentValue) {
      this.securityUser = changes['securityUser'].currentValue;
      this.setFormData();
    }
  }

  initForm(){
    this.invoicingParameterForm = this.formBuilder.group({
      price_per_hour:      [0],
      increment_factor:    ['Minuto'],
      price_per_increment: [0],
      allow_retainers:     [false],
      allow_flat_fee:      [false]
    })

    this.invoicingParameterForm.valueChanges.subscribe(val => {
      this.billingFeeOutput.emit(val);
    });
  }

  setFormData(){

    const subscriptionBillingFee:SubscriptionBillingFee = this.subscriptionBillingFee[0];

     if(this.securityUser){

      const securityUserBillingFee:SubscriptionBillingFee = this.securityUser.billing_fees[0];

      this.invoicingParameterForm.patchValue({
        price_per_hour: securityUserBillingFee.price_per_hour ? securityUserBillingFee.price_per_hour : subscriptionBillingFee.price_per_hour,
        increment_factor: securityUserBillingFee.increment_factor ? securityUserBillingFee.increment_factor : subscriptionBillingFee.increment_factor,
        price_per_increment: securityUserBillingFee.price_per_increment ? securityUserBillingFee.price_per_increment : subscriptionBillingFee.price_per_increment,
        allow_retainers: securityUserBillingFee.allow_retainers != null ? securityUserBillingFee.allow_retainers : subscriptionBillingFee.allow_retainers,
        allow_flat_fee: securityUserBillingFee.allow_flat_fee != null ? securityUserBillingFee.allow_flat_fee : subscriptionBillingFee.allow_flat_fee,
      });

      this.incrementOfTime = securityUserBillingFee.price_per_increment ? true : false;
     }
     else{
      this.invoicingParameterForm.patchValue({
        ...subscriptionBillingFee
      })

      this.incrementOfTime = subscriptionBillingFee.price_per_increment ? true : false;
     }



  }

  getSubscriptionBillingFee(){
    this.subscriptionService.getSubscriptionBillingFee(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.subscriptionBillingFee = data;
      this.setFormData();
    })
  }

}
