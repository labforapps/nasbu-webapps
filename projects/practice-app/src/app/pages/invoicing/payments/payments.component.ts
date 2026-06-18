import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Invoice, Payment, PaymentCheckoutRequestItem, SubscriptionPaymentGateway } from 'core-models';
import { AccountingService, AuthService, SubscriptionService } from 'core-services';
import { DialogPaymentRegisterComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-payment-register/dialog-payment-register.component';
import { DialogPaymentRequestComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-payment-request/dialog-payment-request.component';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {

  payments: Payment[] = [];
  paymentLinks: PaymentCheckoutRequestItem[] = [];
  invoicesMap: Map<string, Invoice> = new Map();
  isLoading: boolean = true;
  selectedSubscription: any;

  constructor(
    private authService: AuthService,
    private accountingService: AccountingService,
    private subscriptionService: SubscriptionService,
    private helpersService: HelpersService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.loadData();
  }

  loadData(): void {
    const uuid = this.selectedSubscription?.ssid.uuid;
    forkJoin({
      payments: this.accountingService.getPayments(uuid),
      paymentLinks: this.accountingService.getPaymentCheckoutRequests(uuid),
      invoices: this.accountingService.getInvoices(uuid),
    }).subscribe({
      next: ({ payments, paymentLinks, invoices }) => {
        this.payments = this.helpersService.sortByDate(payments, 'payment_date', 'desc');
        this.paymentLinks = this.helpersService.sortByDate(paymentLinks, 'created_at', 'desc');
        this.invoicesMap = new Map(invoices.map(inv => [inv.uuid!, inv]));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openDialogPaymentRegister(): void {
    const dialogRef = this.dialog.open(DialogPaymentRegisterComponent);
    dialogRef.afterClosed().subscribe(() => this.onDataChanged());
  }

  openDialogPaymentRequest(): void {
    this.subscriptionService
      .getSubscriptionPaymentGateway(this.selectedSubscription?.ssid.uuid)
      .subscribe((paymentGateways: SubscriptionPaymentGateway[]) => {
        const dialogRef = this.dialog.open(DialogPaymentRequestComponent, {
          data: { paymentGateways },
        });
        dialogRef.afterClosed().subscribe(() => this.onDataChanged());
      });
  }

  onDataChanged(): void {
    this.isLoading = true;
    this.loadData();
  }
}
