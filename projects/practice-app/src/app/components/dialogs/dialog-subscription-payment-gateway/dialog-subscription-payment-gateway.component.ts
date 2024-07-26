import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { CreateSubscriptionPaymentGateway, PaymentGateway, SubscriptionPaymentGateway } from 'core-models';
import { AuthService, CommonService, SubscriptionService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-subscription-payment-gateway',
  templateUrl: './dialog-subscription-payment-gateway.component.html',
  styleUrls: ['./dialog-subscription-payment-gateway.component.scss']
})
export class DialogSubscriptionPaymentGateway implements OnInit {

  selectedSubscription!:any;
  paymentGateways!:PaymentGateway[]
  paymentGatewaySelected!:PaymentGateway | undefined;
  totalTabs:number = 0
  paymentGatewayForm!:FormGroup;
  subscriptionPaymentGateway!:SubscriptionPaymentGateway

  constructor(private authService:AuthService,
              private commonService:CommonService,
              private formBuilder:FormBuilder,
              private helperService:HelpersService,
              private subscriptionService:SubscriptionService,
              @Inject(MAT_DIALOG_DATA) private dataDialog: {subscriptionPaymentGateway:SubscriptionPaymentGateway},
              private dialogRef: MatDialogRef<DialogSubscriptionPaymentGateway>) { }

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

  setForm(){

    if(this.dataDialog && this.dataDialog.subscriptionPaymentGateway){

      this.subscriptionPaymentGateway = this.dataDialog.subscriptionPaymentGateway

      this.paymentGatewayForm.patchValue({
        payment_gateway: this.subscriptionPaymentGateway.payment_gateway.uuid
      })

      this.paymentGatewaySelected = this.dataDialog.subscriptionPaymentGateway.payment_gateway

      const variables:any = JSON.parse(JSON.parse( this.subscriptionPaymentGateway.payment_gateway_info || ''))

      Object.keys(variables).forEach(variable => {
            this.paymentGatewayForm.addControl(`${variable}`,this.formBuilder.control(`${variables[variable]}`))
      });

    }

  }

  getPaymentGateways(){
    this.commonService.getPaymentGateways().subscribe({
      next: (data) => {
        this.paymentGateways = data
        this.setForm()
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

    if(this.subscriptionPaymentGateway) payload.uuid = this.subscriptionPaymentGateway.uuid

    this.subscriptionService.saveSubscriptionPaymentGateway(payload).subscribe({
      next: (data) => {
        if(this.subscriptionPaymentGateway){
          this.helperService.showMessageUpdated()
        }
        else{
          this.helperService.showMessageCreated()
        }

        this.dialogRef.close()

      }
    })

  }

}
