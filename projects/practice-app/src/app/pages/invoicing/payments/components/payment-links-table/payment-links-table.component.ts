import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice, PaymentCheckoutRequestItem, paymentCheckoutRequestStatusDescription, sendingMethodDescription } from 'core-models';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-payment-links-table',
  templateUrl: './payment-links-table.component.html',
})
export class PaymentLinksTableComponent implements OnInit, OnChanges {

  @Input() paymentLinks!: PaymentCheckoutRequestItem[];
  @Input() invoicesMap: Map<string, Invoice> = new Map();
  @Input() selectedSubscriptionId!: string;

  displayedColumns: string[] = ['date', 'invoice', 'client', 'amount', 'send_by', 'status', 'link'];
  dataSource = new MatTableDataSource<PaymentCheckoutRequestItem>();
  statusDescription = paymentCheckoutRequestStatusDescription;
  sendingMethodDescription = sendingMethodDescription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private helperService: HelpersService) {}

  ngOnInit(): void {
    this.dataSource.data = this.paymentLinks;
    this.dataSource.filterPredicate = (data: PaymentCheckoutRequestItem, filter: string): boolean => {
      const invoice = this.invoicesMap.get(data.invoice);
      let searchableString = '';
      if (invoice?.customer) {
        searchableString += invoice.customer.first_name ?? '';
        searchableString += invoice.customer.last_name ?? '';
        searchableString += invoice.customer.company_name ?? '';
      }
      return searchableString.toLowerCase().includes(filter);
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentLinks'] && this.paymentLinks) {
      this.dataSource.data = this.paymentLinks;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  searchByName(event: any): void {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  getInvoice(invoiceUuid: string): Invoice | undefined {
    return this.invoicesMap.get(invoiceUuid);
  }

  copyLink(url: string): void {
    this.helperService.copyToClipboard(url);
    this.helperService.showCustomMessage('Ok', 'Link copiado', 'Link copiado al portapapeles');
  }
}
