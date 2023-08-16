import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Customer, Invoice, InvoiceStatus, Payment, PaymentMethod, TypeContact, sendDocument } from 'core-models';
import { AccountingService, AuthService, CustomersService } from 'core-services';
import * as moment from 'moment';
import { HelpersService } from '../../../services/helpers.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog-payment-register',
  templateUrl: './dialog-payment-register.component.html',
  styleUrls: ['./dialog-payment-register.component.scss']
})
export class DialogPaymentRegisterComponent implements OnInit {

  paymentForm!:FormGroup;
  payment!:Payment;
  paymentMethod = PaymentMethod;
  selectedSubscription!:any;
  invoices!:Invoice[];
  invoice!:Invoice | undefined;
  customer!:Customer;
  typeContact = TypeContact;
  invoiceStatus = InvoiceStatus;
  emails:string[] = [];

  constructor(private formBuilder:FormBuilder,
              private accountService:AccountingService,
              private authService: AuthService,
              private customerService:CustomersService,
              public  dialogRef: MatDialogRef<DialogPaymentRegisterComponent>,
              private helperService:HelpersService,
              @Inject(MAT_DIALOG_DATA) public dataDialog:{invoice:Invoice}) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getInvoices();
    this.initForm();

    if(this.dataDialog && this.dataDialog.invoice){
      this.invoice = this.dataDialog.invoice;
      this.paymentForm.patchValue({invoice: this.invoice.uuid})
    }
  }


  get currentDate() {
    return moment().format('MM/DD/YYYY');
  }

  initForm(){

    this.paymentForm = this.formBuilder.group({
      payment_method: ['',Validators.required],
      total_amt:      ['',Validators.required],
      invoice:        ['',Validators.required]
    })

  }

  getInvoices(){
    this.accountService.getInvoices(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.invoices = data.filter(x => x.status === this.invoiceStatus.PENDING || x.status === this.invoiceStatus.EXPIRED);
    })
  }

  onInvoiceChange(select:MatSelectChange){
    const invoiceUUID = select.value;
    this.invoice = this.invoices.find(x => x.uuid === invoiceUUID );

    this.customerService.getCustomerById(this.selectedSubscription?.ssid.uuid,this.invoice?.customer.uuid || '').subscribe(data => {
      this.customer = data;
    })
  }

  onSubmit(){

    console.log(this.paymentForm.value);

    if(!this.paymentForm.valid){
      this.helperService.showMessageRequiredFields();
      return;
    }

    const myDate = moment();

    const payment:Payment = {
      payment_date:   '2023-08-13',
      subscription:   this.selectedSubscription?.ssid.uuid,
      customer:       this.invoice?.customer.uuid,
      ...this.paymentForm.value
    }

    this.accountService.createPayment(this.selectedSubscription?.ssid.uuid,payment).subscribe(data => {
      this.helperService.showMessageCreated();
      this.payment = data;
      if(this.emails.length > 0) this.sendPayment();
      this.dialogRef.close({});
    })


  }

  addEmail(event: MatCheckboxChange,email:string){

    if(event.checked){
      this.emails.push(email);
    }
    else{
      this.emails = this.emails.filter(x => x !== email);
    }

  }

  sendPayment(){
    const emails = this.emails.join(", ");

    const document:sendDocument = {
      uuid: this.payment?.uuid || '',
      subscription: this.invoice?.subscription || '',
      send_by: 'email',
      to_origin_value: emails
    }

    this.accountService.sendPayment(document).subscribe(data => {
      this.helperService.showCustomMessage('Ok','Ok','Correo Enviado');
      this.dialogRef.close({})
    })
  }

}
