import { Component, Input, OnInit } from '@angular/core';
import { Invoice, InvoiceStatus, SecurityUser } from 'core-models';
import { AccountingService } from 'core-services';

@Component({
  selector: 'app-collaborator-invoicing',
  templateUrl: './collaborator-invoicing.component.html',
  styleUrls: ['./collaborator-invoicing.component.scss']
})
export class CollaboratorInvoicingComponent implements OnInit {

  @Input() securityUser!:SecurityUser;
  invoices!:Invoice[];
  invoiceStatus = InvoiceStatus;

  constructor(private accountinService:AccountingService) { }

  ngOnInit(): void {
    this.getInvoicesBySecurityUser();
  }

  getInvoicesBySecurityUser(){
    this.accountinService.getInvoices(this.securityUser.subscription).subscribe(data => {
      this.invoices = data.filter(x => x.created_by === this.securityUser.uuid);
    })
  }

}
