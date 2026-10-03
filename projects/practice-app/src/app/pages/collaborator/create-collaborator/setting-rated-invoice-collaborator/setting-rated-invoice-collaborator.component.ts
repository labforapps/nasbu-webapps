import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
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
  subscriptionAllowsRetainers = false;
  subscriptionAllowsFlatFee   = false;
  subscriptionAllowsIncrement = false;

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
      increment_factor:    [0],
      price_per_increment: [0],
      allow_retainers:     [false],
      allow_flat_fee:      [false],
      allow_time_increment:[false]
    })

    this.invoicingParameterForm.valueChanges.subscribe(() => {
      this.billingFeeOutput.emit(this.invoicingParameterForm.getRawValue());
    });
  }

  setFormData(){

    const subscriptionBillingFee:SubscriptionBillingFee = this.subscriptionBillingFee[0];

     if(this.securityUser){

      const securityUserBillingFee:SubscriptionBillingFee = this.securityUser.billing_fees[0];

      this.invoicingParameterForm.patchValue({
        price_per_hour: securityUserBillingFee.price_per_hour ? securityUserBillingFee.price_per_hour : subscriptionBillingFee.price_per_hour,
        increment_factor: securityUserBillingFee.increment_factor >= 0 ? securityUserBillingFee.increment_factor : subscriptionBillingFee.increment_factor,
        price_per_increment: securityUserBillingFee.price_per_increment ? securityUserBillingFee.price_per_increment : subscriptionBillingFee.price_per_increment,
        allow_retainers: securityUserBillingFee.allow_retainers != null ? securityUserBillingFee.allow_retainers : subscriptionBillingFee.allow_retainers,
        allow_flat_fee: securityUserBillingFee.allow_flat_fee != null ? securityUserBillingFee.allow_flat_fee : subscriptionBillingFee.allow_flat_fee,
        allow_time_increment: securityUserBillingFee.allow_time_increment != null ? securityUserBillingFee.allow_time_increment : subscriptionBillingFee.allow_time_increment,
      });
     }
     else{
      this.invoicingParameterForm.patchValue({
        ...subscriptionBillingFee
      })
     }

     if(!this.subscriptionAllowsRetainers) this.invoicingParameterForm.patchValue({ allow_retainers: false });
     if(!this.subscriptionAllowsFlatFee)   this.invoicingParameterForm.patchValue({ allow_flat_fee: false });
     if(!this.subscriptionAllowsIncrement){
       this.invoicingParameterForm.patchValue({ allow_time_increment: false, increment_factor: 0, price_per_increment: 0 });
     }

  }

  applySubscriptionCapabilities(){
    const retainer  = this.invoicingParameterForm.get('allow_retainers');
    const flatFee   = this.invoicingParameterForm.get('allow_flat_fee');
    const increment = this.invoicingParameterForm.get('allow_time_increment');
    this.subscriptionAllowsRetainers ? retainer?.enable({emitEvent:false})  : retainer?.disable({emitEvent:false});
    this.subscriptionAllowsFlatFee   ? flatFee?.enable({emitEvent:false})   : flatFee?.disable({emitEvent:false});
    this.subscriptionAllowsIncrement ? increment?.enable({emitEvent:false}) : increment?.disable({emitEvent:false});
  }

  onCheckIncrementOfTime(event:MatCheckboxChange){
    if(!event.checked){
      this.invoicingParameterForm.patchValue({
        increment_factor:    0,
        price_per_increment: 0,
      })
    }
  }

  getSubscriptionBillingFee(){
    this.subscriptionService.getSubscriptionBillingFee(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.subscriptionBillingFee = data;

      const subFee = data[0];
      this.subscriptionAllowsRetainers = !!subFee?.allow_retainers;
      this.subscriptionAllowsFlatFee   = !!subFee?.allow_flat_fee;
      this.subscriptionAllowsIncrement = !!subFee?.allow_time_increment;

      this.applySubscriptionCapabilities();
      this.setFormData();
    })
  }

}
