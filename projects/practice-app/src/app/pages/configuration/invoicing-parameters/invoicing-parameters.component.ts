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
      subscription: [this.selectedSubscription],
      price_per_hour:      [''],
      increment_factor:    ['Minuto'],
      price_per_increment: [''],
      allow_retainers:     [false],
      allow_flat_fee:      [false]
    })
  }

  setFormData(){
    this.invoicingParameterForm.patchValue(this.subscriptionBillingFee[0]);
  }

  submitForm(){
    console.log(this.invoicingParameterForm.value);

    this.subscriptionService.updateSubscriptionBillingFee(this.selectedSubscription?.ssid.uuid,this.subscriptionBillingFee[0].uuid || '',this.invoicingParameterForm.value).subscribe(data => {
      this.toastr.success('Ok','Billing Fee Saved Changes')
    })


  }



}
