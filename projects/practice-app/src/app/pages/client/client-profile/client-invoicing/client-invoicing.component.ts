import { Component, Input, OnInit } from '@angular/core';
import { Customer, Invoice, InvoiceStatus } from 'core-models';
import { CustomersService } from 'core-services';

@Component({
  selector: 'app-client-invoicing',
  templateUrl: './client-invoicing.component.html',
  styleUrls: ['./client-invoicing.component.scss']
})
export class ClientInvoicingComponent implements OnInit {

  @Input() customer!:Customer;
  invoices!:Invoice[];
  invoiceStatus = InvoiceStatus;

  constructor(private customerService:CustomersService) { }

  ngOnInit(): void {
    this.getInvoicesByCustomer();
  }

  getInvoicesByCustomer(){
    this.customerService.getInvoicesByCustomer(this.customer).subscribe(data => {
      this.invoices = data;
    })
  }



}
