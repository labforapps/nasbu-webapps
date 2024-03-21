import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer, Invoice, TypeContact, sendDocument } from 'core-models';
import { AccountingService, CustomersService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog-send-invoice',
  templateUrl: './dialog-send-invoice.component.html',
  styleUrls: ['./dialog-send-invoice.component.scss']
})
export class DialogSendInvoiceComponent implements OnInit {

  invoice!:Invoice;
  customer!:Customer;
  typeContact = TypeContact;
  emails:string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dataDialog:{invoice:Invoice},
              public  dialogRef: MatDialogRef<DialogSendInvoiceComponent>,
              private customerService:CustomersService,
              private accountingService:AccountingService,
              private helperService:HelpersService) { }

  ngOnInit(): void {
    this.invoice = this.dataDialog.invoice;
    this.getCustomerById();
  }

  getCustomerById(){
    this.customerService.getCustomerById(this.invoice.subscription,this.invoice.customer.uuid || '').subscribe(data => {
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
      uuid: this.invoice.uuid || '',
      subscription: this.invoice.subscription,
      send_by: 'email',
      to_origin_value: emails
    }

    this.accountingService.sendInvoice(document).subscribe(data => {
      this.helperService.showCustomMessage('Ok','Ok','Correo Enviado');
      this.dialogRef.close({})
    })

  }

}
