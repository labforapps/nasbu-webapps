import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogRecoveryComponent } from '../dialog-recovery/dialog-recovery.component';
import { AuthService,CustomersService } from 'core-services';
import { CustomerIntakeRequest } from 'core-models';

@Component({
  selector: 'app-dialog-send-register',
  templateUrl: './dialog-send-register.component.html',
  styleUrls: ['./dialog-send-register.component.scss'],
})
export class DialogSendRegisterComponent implements OnInit {
  //selectedSubscription!: SelectedSubscription | null;
  selectedSubscription!: any;
  sendingMethod: string = 'email';
  formSubmitted: boolean = false;
  emailField: string = '';
  phoneNumberField: string = '';

  customer_intake_request!:CustomerIntakeRequest;

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private customerService:CustomersService) {}

  ngOnInit(): void {

    this.selectedSubscription =
      this.authService.getUserInfoFromLocalStorage();

      this.customer_intake_request = {
        subscription: this.selectedSubscription?.ssid.uuid,
        type: 'P',
        name: '',
        send_by: this.sendingMethod,
        to_origin_value: '',
      };

  }

  onChangeSendingMethod(event: any) {
    this.sendingMethod = event.value;
  }

  validateFields(): boolean {
    let result = true;
    this.formSubmitted = true;

    this.customer_intake_request.to_origin_value =
      this.sendingMethod === 'email' ? this.emailField : this.phoneNumberField;

    if (
      this.customer_intake_request.name === '' ||
      this.customer_intake_request.to_origin_value === ''
    )
      result = false;

    return result;
  }

  sendCustomerIntakeRequest() {
    const formValidated = this.validateFields();

    if (!formValidated) {
      return;
    }

    this.customerService.createCustomerIntakeRequest(this.customer_intake_request).subscribe(data => {
      console.log(data);
    })

  }
}
