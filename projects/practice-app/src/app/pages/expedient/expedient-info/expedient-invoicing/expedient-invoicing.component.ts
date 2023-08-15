import { Component, Input, OnInit } from '@angular/core';
import { CaseFile, Invoice, InvoiceStatus } from 'core-models';
import { AccountingService } from 'core-services';

@Component({
  selector: 'app-expedient-invoicing',
  templateUrl: './expedient-invoicing.component.html',
  styleUrls: ['./expedient-invoicing.component.scss']
})
export class ExpedientInvoicingComponent implements OnInit {

  @Input() caseFile!:CaseFile;

  invoices!:Invoice[];
  invoiceStatus = InvoiceStatus;

  constructor(private accountinService:AccountingService) { }

  ngOnInit(): void {
    this.getInvoicesByCaseFile();
  }

  getInvoicesByCaseFile(){
    this.accountinService.getInvoices(this.caseFile.subscription).subscribe(data => {
      console.log(data);
      this.invoices = data.filter(x => x.case_file && x.case_file.uuid === this.caseFile.uuid);
      console.log(this.invoices);
    })
  }

}
