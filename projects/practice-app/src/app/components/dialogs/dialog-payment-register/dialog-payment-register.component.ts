import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Customer, Invoice, Payment, PaymentMethod, TypeContact } from 'core-models';
import { AccountingService, AuthService, CustomersService } from 'core-services';
import * as moment from 'moment';
import { HelpersService } from '../../../services/helpers.service';

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

  constructor(private formBuilder:FormBuilder,
              private accountService:AccountingService,
              private authService: AuthService,
              private customerService:CustomersService,
              public  dialogRef: MatDialogRef<DialogPaymentRegisterComponent>,
              private helperService:HelpersService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getInvoices();
    this.initForm();
  }


  get currentDate() {
    return moment().format('MM/DD/YYYY');
  }

  initForm(){

    this.paymentForm = this.formBuilder.group({
      payment_method: [''],
      total_amt:      [''],
      invoice:        ['']
    })

  }

  getInvoices(){
    this.accountService.getInvoices(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.invoices = data;
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

    const myDate = moment();


    const payment:Payment = {
      payment_date:   '2023-08-13',
      subscription:   this.selectedSubscription?.ssid.uuid,
      customer:       this.invoice?.customer.uuid,
      ...this.paymentForm.value
    }

    this.accountService.createPayment(this.selectedSubscription?.ssid.uuid,payment).subscribe(data => {
      this.helperService.showMessageCreated();
      this.dialogRef.close({});
    })


  }

}
