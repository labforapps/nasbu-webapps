import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPaymentRegisterComponent } from '../../components/dialogs/dialog-payment-register/dialog-payment-register.component';
import { Invoice, InvoiceStatus } from 'core-models';
import { AccountingService } from 'projects/core-services/src/lib/services/accounting/accounting.service';
import { AuthService, SubscriptionService } from 'core-services';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.scss']
})
export class InvoicingComponent implements OnInit {

  public invoices:Invoice[] = [];
  invoicesLoaded = false;
  invoiceStatus = InvoiceStatus;
  selectedSubscription!:any;

  constructor(public dialog: MatDialog,
              private accountingServices: AccountingService,
              private subscriptionService: SubscriptionService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getInvoices();
  }

  getInvoices(){
    this.accountingServices.getInvoices(this.selectedSubscription?.ssid.uuid).subscribe({
      next: (data:Invoice[]) => {
        this.invoices = data;
        this.invoicesLoaded = true;
      },
      error: () => this.invoicesLoaded = true
    })
  }

  get allInvoices() {
    return this.invoices;
  }

  get notApprovedInvoices() {
    return this.invoices.filter(x => x.status === this.invoiceStatus.NOT_APPROVED);
  }

  get pendingInvoices() {
    return this.invoices.filter(x => x.status === this.invoiceStatus.PENDING);
  }

  get payedInvoices() {
    return this.invoices.filter(x => x.status === this.invoiceStatus.PAYED);
  }

  get expiredInvoices() {
    return this.invoices.filter(x => x.status === this.invoiceStatus.EXPIRED);
  }

  onExecuteInvoice(){
    this.getInvoices();
  }

  openDialogPaymentRegister(){
    const dialogRef = this.dialog.open(DialogPaymentRegisterComponent);

    dialogRef.afterClosed().subscribe((result:Invoice) => {
      this.getInvoices();
    });
  }

}
