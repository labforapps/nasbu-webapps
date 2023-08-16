import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer, Invoice, Payment, TypeContact, sendDocument } from 'core-models';
import { AccountingService, CustomersService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog-send-payment',
  templateUrl: './dialog-send-payment.component.html',
  styleUrls: ['./dialog-send-payment.component.scss']
})
export class DialogSendPaymentComponent implements OnInit {

  customer!:Customer;
  typeContact = TypeContact;
  emails:string[] = [];
  payment!:Payment;

  constructor(@Inject(MAT_DIALOG_DATA) public dataDialog:{payment:Payment},
              public  dialogRef: MatDialogRef<DialogSendPaymentComponent>,
              private customerService:CustomersService,
              private accountingService:AccountingService,
              private helperService:HelpersService) { }

  ngOnInit(): void {
    this.payment = this.dataDialog.payment;
    this.getCustomerById();
  }

  getCustomerById(){
    this.customerService.getCustomerById(this.payment.subscription,this.payment.customer.uuid || '').subscribe(data => {
      this.customer = data;
    } )
  }

  addEmail(event: MatCheckboxChange,email:string){

    if(event.checked){
      this.emails.push(email);
    }
    else{
      this.emails = this.emails.filter(x => x !== email);
    }

  }

  sendInvoice(){

    if(this.emails.length === 0){
     this.helperService.showCustomMessage('Error','Error','Debes elegir un correo para enviar la factura');
     return;
    }

    const emails = this.emails.join(", ");

    const document:sendDocument = {
      uuid: this.payment.uuid || '',
      subscription: this.payment.subscription,
      send_by: 'email',
      to_origin_value: emails
    }

    this.accountingService.sendPayment(document).subscribe(data => {
      this.helperService.showCustomMessage('Ok','Ok','Correo Enviado');
      this.dialogRef.close({})
    })

  }


}
