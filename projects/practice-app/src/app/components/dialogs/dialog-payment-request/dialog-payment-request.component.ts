import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Customer, Invoice, InvoiceStatus, Payment, PaymentCheckoutRequest, PaymentMethod, TypeContact, sendDocument } from 'core-models';
import { AccountingService, AuthService, CustomersService } from 'core-services';
import * as moment from 'moment';
import { HelpersService } from '../../../services/helpers.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog-payment-request',
  templateUrl: './dialog-payment-request.component.html',
  styleUrls: ['./dialog-payment-request.component.scss']
})
export class DialogPaymentRequestComponent implements OnInit {
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
  sendingMethod: string = 'email';
  formSubmitted: boolean = false;
  emailField: string = '';
  phoneNumberField: string = '';
  paymentType:boolean = true

  constructor(private formBuilder:FormBuilder,
              private accountService:AccountingService,
              private authService: AuthService,
              private customerService:CustomersService,
              public  dialogRef: MatDialogRef<DialogPaymentRequestComponent>,
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
      invoice: ['',Validators.required],
      request_invoice_remaining_amt: [true,Validators.required],
      payment_amt: ['0',Validators.required],
      send_by: ['email',Validators.required],
      to_origin_value: ['',Validators.required]
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

  addEmail(event: MatCheckboxChange,email:string){
    if(event.checked){
      this.emails.push(email);
    }
    else{
      this.emails = this.emails.filter(x => x !== email);
    }
  }

  onSubmit(){
    // if(!this.paymentForm.valid){
    //   this.helperService.showMessageRequiredFields();
    //   return;
    // }

    this.sendPayment()

  }

  sendPayment(){

    const document: PaymentCheckoutRequest = {
      subscription: this.invoice?.subscription || '',
      customer: this.invoice?.customer.uuid || '',
      invoice: this.invoice?.uuid || '',
      request_invoice_remaining_amt: this.paymentForm.value.request_invoice_remaining_amt,
      payment_amt: this.paymentForm.value.payment_amt,
      send_by: this.paymentForm.value.send_by,
      to_origin_value: this.paymentForm.value.send_by === 'email' ? this.emailField : this.phoneNumberField
    }

    this.accountService.createPaymentCheckoutRequest(document).subscribe(data => {
      this.helperService.showCustomMessage('Ok','Ok','Link de pago enviado');
      this.dialogRef.close({})
    })
  }

  onChangeSendingMethod(event: any) {
    this.sendingMethod = event.value;
  }

  onChangePaymentType(event:any){
    this.paymentType = event.value
  }

  setPhoneField(value: any) {
    this.phoneNumberField = value.replace(/[\s-]/g, '');
  }

}
