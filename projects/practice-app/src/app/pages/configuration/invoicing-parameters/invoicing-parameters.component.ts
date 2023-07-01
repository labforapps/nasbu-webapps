import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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


  constructor(private formBuilder:FormBuilder,
              private subscriptionService:SubscriptionService,
              private authService: AuthService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
  }

  initForm(){
    this.invoicingParameterForm = this.formBuilder.group({
      price_per_hour:      [''],
      increment_factor:    [''],
      price_per_increment: [''],
      allow_retainers:     [false],
      allow_flat_fee:      [false]
    })
  }

  submitForm(){
    console.log(this.invoicingParameterForm.value);

    this.subscriptionService.createSubscriptionBillingFee(this.selectedSubscription?.ssid.uuid,this.invoicingParameterForm.value).subscribe(data => {

    })


  }



}
