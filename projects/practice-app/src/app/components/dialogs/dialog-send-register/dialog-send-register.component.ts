import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogRecoveryComponent } from '../dialog-recovery/dialog-recovery.component';
import { AuthService,CustomersService } from 'core-services';
import { CustomerIntakeRequest } from 'core-models';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DialogReSendRegisterComponent } from '../dialog-re-send-register-email/dialog-re-send-register.component';


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

  customer_intake_request!: CustomerIntakeRequest;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private customerService: CustomersService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

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

  setPhoneField(value: any) {
    this.phoneNumberField = value.replace(/[\s-]/g, '');
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

    this.customer_intake_request.send_by = this.sendingMethod;

    if (!formValidated) {
      return;
    }

    this.customerService
      .createCustomerIntakeRequest(this.customer_intake_request)
      .subscribe(
        (data) => {
          this.toastr.success(
            'Ok',
            this.translateService.instant('successMessages.created_succesfully')
          );

          this.openDialogReSendRegister();

          console.log(data);
        },
        (error: any) => {
          this.toastr.error(
            'Error',
            this.translateService.instant('errorMessages.unexpectedError')
          );
        }
      );
  }

  openDialogReSendRegister() {

    this.dialog.closeAll();

     const dialogConfig: MatDialogConfig = {
       data: { body: this.customer_intake_request },
     };

    this.dialog.open(DialogReSendRegisterComponent, dialogConfig);
  }
}
