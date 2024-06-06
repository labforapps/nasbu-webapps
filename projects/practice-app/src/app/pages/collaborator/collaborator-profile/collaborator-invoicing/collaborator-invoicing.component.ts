import { Component, Input, OnInit } from '@angular/core';
import { Invoice, InvoiceStatus, SecurityUser } from 'core-models';
import { SecurityService } from 'core-services';

@Component({
  selector: 'app-collaborator-invoicing',
  templateUrl: './collaborator-invoicing.component.html',
  styleUrls: ['./collaborator-invoicing.component.scss']
})
export class CollaboratorInvoicingComponent implements OnInit {

  @Input() securityUser!:SecurityUser;
  invoices!:Invoice[];
  invoiceStatus = InvoiceStatus;

  constructor(private securityService:SecurityService) { }

  ngOnInit(): void {
    this.getInvoicesBySecurityUser();
  }

  getInvoicesBySecurityUser(){
    this.securityService.getInvoicesBySecurityUser(this.securityUser).subscribe(data => {
      this.invoices = data;
    })
  }

}
