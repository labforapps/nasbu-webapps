import { Component, Inject, OnInit } from '@angular/core';
import { Invoice, Payment } from 'core-models';
import { HelpersService } from '../../../services/helpers.service';
import { AccountingService, AuthService } from 'core-services';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogSendPaymentComponent } from '../dialog-send-payment/dialog-send-payment.component';

@Component({
  selector: 'app-dialog-payment-history',
  templateUrl: './dialog-payment-history.component.html',
  styleUrls: ['./dialog-payment-history.component.scss']
})
export class DialogPaymentHistoryComponent implements OnInit {

  payments:Payment[] = [];
  invoice!:Invoice;
  selectedSubscription!:any;

  constructor(private helperService:HelpersService,
              private accountingService:AccountingService,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public dataDialog:{invoice:Invoice},
              private dialog:MatDialog) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.invoice = this.dataDialog.invoice;
    this.getInvoicePayments();
  }

  getInvoicePayments(){
    this.accountingService.getInvoicePayments(this.selectedSubscription?.ssid.uuid,this.invoice.uuid || '').subscribe(data => {
      this.payments = data;
    })
  }

  get totalInvoice(){
    return Number(this.invoice.net_amt);
  }

  get pendingPayment() {
    return this.totalInvoice - this.totalPayment;
  }

  get totalPayment() {
    return this.payments.reduce((acc, payment) => acc + parseFloat(payment.total_amt), 0);;
  }

  deletePayment(payment:Payment){
    this.helperService.showConfirmationDeleteDialog().then( (result) => {
      if(result.isConfirmed){
        this.accountingService.deletePayment(this.selectedSubscription?.ssid.uuid,payment.uuid || '').subscribe(data => {
          this.getInvoicePayments();
          this.helperService.showMessageDeleted();
        })
      }
    })
  }

  openDialogSendPayment(payment:Payment){
    this.dialog.open(DialogSendPaymentComponent,{
      data: {
        payment
      }
    });
  }

}
