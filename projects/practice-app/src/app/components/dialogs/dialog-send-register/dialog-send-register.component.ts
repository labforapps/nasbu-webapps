import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService,CustomersService } from 'core-services';
import { CustomerIntakeRequest, SendingMethod } from 'core-models';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DialogReSendRegisterComponent } from '../dialog-re-send-register-email/dialog-re-send-register.component';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-dialog-send-register',
  templateUrl: './dialog-send-register.component.html',
  styleUrls: ['./dialog-send-register.component.scss'],
})
export class DialogSendRegisterComponent implements OnInit {

  selectedSubscription!: any;
  formSubmitted: boolean = false;
  emailField: string = '';
  phoneNumberField: string = '';
  customer_intake_request!: CustomerIntakeRequest;
  sendingMethod = SendingMethod

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private customerService: CustomersService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private helperService:HelpersService
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.customer_intake_request = {
      subscription: this.selectedSubscription?.ssid.uuid,
      type: 'P',
      name: '',
      send_by: "clipboard",
      to_origin_value: 'X',
    };
  }

  setPhoneField(value: any) {
    this.phoneNumberField = value.replace(/[\s-]/g, '');
  }

  validateFields(): boolean {
    let result = true;
    this.formSubmitted = true;

    if(this.customer_intake_request.send_by === this.sendingMethod.EMAIL) this.customer_intake_request.to_origin_value = this.emailField
    if(this.customer_intake_request.send_by === this.sendingMethod.SMS) this.customer_intake_request.to_origin_value = this.phoneNumberField
    if(this.customer_intake_request.send_by === this.sendingMethod.CLIPBOARD) this.customer_intake_request.to_origin_value = this.sendingMethod.CLIPBOARD

    if (this.customer_intake_request.name === '' || this.customer_intake_request.to_origin_value === '') result = false;

    return result;
  }

  sendCustomerIntakeRequest() {
    const formValidated = this.validateFields();

    if (!formValidated) {
      return;
    }

    this.customerService.createCustomerIntakeRequest(this.customer_intake_request).subscribe({
        next: (data:CustomerIntakeRequest) => {

          if(this.customer_intake_request.send_by === this.sendingMethod.CLIPBOARD){
             this.helperService.copyToClipboard(data.intake_request_url || '')
             this.helperService.showCustomMessage('Ok','Ok','Link Copiado en el portapeles');

          }
          else{
            this.toastr.success('Ok',this.translateService.instant('successMessages.created_succesfully'));
            this.openDialogReSendRegister();
          }

        },
        error: (error) => {
          this.toastr.error('Error',this.translateService.instant('errorMessages.unexpectedError'))
        }
     });
  }

  openDialogReSendRegister() {

    this.dialog.closeAll();

     const dialogConfig: MatDialogConfig = {
       data: { body: this.customer_intake_request },
     };

    this.dialog.open(DialogReSendRegisterComponent, dialogConfig);
  }
}
