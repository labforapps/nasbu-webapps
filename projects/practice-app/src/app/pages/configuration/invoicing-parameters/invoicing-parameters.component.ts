import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubscriptionBillingFee } from 'core-models';
import { AuthService, SubscriptionService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-invoicing-parameters',
  templateUrl: './invoicing-parameters.component.html',
  styleUrls: ['./invoicing-parameters.component.scss']
})
export class InvoicingParametersComponent implements OnInit {

  invoicingParameterForm!:FormGroup;
  selectedSubscription!: any;
  subscriptionBillingFee!:SubscriptionBillingFee[];
  addHourlyRate:boolean = false
  perIncrementOfTime:boolean = false

  constructor(private formBuilder:FormBuilder,
              private subscriptionService:SubscriptionService,
              private authService: AuthService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.getSubscriptionBillingFee();
  }

  getSubscriptionBillingFee(){
    this.subscriptionService.getSubscriptionBillingFee(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.subscriptionBillingFee = data;
      this.setFormData();
    })
  }

  initForm(){
    this.invoicingParameterForm = this.formBuilder.group({
      price_per_hour:      [0],
      increment_factor:    [0],
      price_per_increment: [0],
      allow_retainers:     [false],
      allow_flat_fee:      [false],
      tax_pct: 0
    })
  }

  setFormData(){
    this.invoicingParameterForm.patchValue(this.subscriptionBillingFee[0]);
  }

  submitForm(){

    const subscriptionBillingFeePayload = {
      ...this.invoicingParameterForm.value,
      subscription: this.selectedSubscription?.ssid.uuid
    }

    if(this.subscriptionBillingFee.length > 0 && this.subscriptionBillingFee[0].uuid) {
      subscriptionBillingFeePayload.uuid = this.subscriptionBillingFee[0].uuid
      subscriptionBillingFeePayload.billing_fee_id = this.subscriptionBillingFee[0].billing_fee_id
    }

    this.subscriptionService.saveSubscriptionBillingFee(subscriptionBillingFeePayload).subscribe( data => {
      this.toastr.success('Ok','Billing Fee Saved Changes')
    })

  }



}
