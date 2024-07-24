import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { CreateSubscriptionPaymentGateway, PaymentGateway } from 'core-models';
import { AuthService, CommonService, SubscriptionService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-dialog-add-payment-gateway',
  templateUrl: './dialog-add-payment-gateway.component.html',
  styleUrls: ['./dialog-add-payment-gateway.component.scss']
})
export class DialogAddPaymentGatewayComponent implements OnInit {

  selectedSubscription!:any;
  paymentGateways!:PaymentGateway[]
  paymentGatewaySelected!:PaymentGateway | undefined;
  totalTabs:number = 0
  paymentGatewayForm!:FormGroup;

  constructor(private authService:AuthService,
              private commonService:CommonService,
              private formBuilder:FormBuilder,
              private helperService:HelpersService,
              private subscriptionService:SubscriptionService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm()
    this.getPaymentGateways()
  }

  initForm(){

    this.paymentGatewayForm = this.formBuilder.group({
      payment_gateway: ['',Validators.required]
    })

  }

  getPaymentGateways(){
    this.commonService.getPaymentGateways().subscribe({
      next: (data) => {
        this.paymentGateways = data
      }
    })
  }

  onSelectChange(event:MatSelectChange){

    this.paymentGatewaySelected = this.paymentGateways.find(x => x.uuid === event.value)
    this.paymentGatewaySelected?.variables?.forEach(x => this.paymentGatewayForm.addControl(`${x.value_path}`,this.formBuilder.control('')))

  }

  submitForm(){

    if(!this.paymentGatewayForm.valid){
      this.helperService.showMessageRequiredFields()
      return;
    }

    const payment_gateway_info = this.paymentGatewaySelected?.variables?.map(variable => {

      const obj:{[s: string] : string} = {}

      obj[`${variable.code}`] =  this.paymentGatewayForm.value[variable.value_path];

      return obj
    }).reduce((a,b)  => { return { ...a,...b } },{} )

    const payload:CreateSubscriptionPaymentGateway = {
      subscription: this.selectedSubscription?.ssid.uuid,
      payment_gateway: this.paymentGatewayForm.value.payment_gateway,
      payment_gateway_info: JSON.stringify(payment_gateway_info)
    }

    this.subscriptionService.createSubscriptionPaymentGateway(payload).subscribe({
      next: (data) => {
        this.helperService.showMessageCreated()
      }
    })

  }

}
