import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CustomerIntakeRequest } from 'core-models';
import { Toast, ToastrService } from 'ngx-toastr';
import { CustomersService } from 'projects/core-services/src/public-api';
import { DialogSendRegisterComponent } from '../dialog-send-register/dialog-send-register.component';

@Component({
  selector: 'app-dialog-re-send-register',
  templateUrl: './dialog-re-send-register.component.html',
  styleUrls: ['./dialog-re-send-register.component.scss'],
})
export class DialogReSendRegisterComponent implements OnInit {
  public pageStep: number = 1; // 1-email 2-loading 3-emailSent 4-error
  public customer_intake_request!: CustomerIntakeRequest;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private customerService: CustomersService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {
    this.customer_intake_request = data.body;
  }

  ngOnInit(): void {}

  sendCustomerIntakeRequest() {
    this.pageStep = 2;

    this.customerService
      .createCustomerIntakeRequest(this.customer_intake_request)
      .subscribe(
        (data) => {
          this.toastr.success(
            'Ok',
            this.translateService.instant('successMessages.created_succesfully')
          );

          this.pageStep = 3;

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

  testWithAnother(){
     this.dialog.closeAll();
     this.dialog.open(DialogSendRegisterComponent);
  }

}
