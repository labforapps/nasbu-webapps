import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPaymentRegisterComponent } from '../../components/dialogs/dialog-payment-register/dialog-payment-register.component';
import { Invoice, InvoiceStatus } from 'core-models';
import { AccountingService } from 'projects/core-services/src/lib/services/accounting/accounting.service';
import { AuthService } from 'core-services';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.scss']
})
export class InvoicingComponent implements OnInit {

  public invoices:Invoice[] = [];
  invoiceStatus = InvoiceStatus;
  selectedSubscription!:any;

  constructor(public dialog: MatDialog,
              private accountingServices:AccountingService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getInvoices();
  }

  getInvoices(){
    this.accountingServices.getInvoices(this.selectedSubscription?.ssid.uuid).subscribe((data:Invoice[]) => {
      this.invoices = data;
    })
  }

  // setData(){

  //   const getRandomStatus = (): InvoiceStatus => {
  //     const statuses = Object.values(InvoiceStatus);
  //     return statuses[Math.floor(Math.random() * statuses.length)];
  //   };

  //     for (let i = 0; i < 10; i++) {
  //       const invoice: Invoice = {
  //           uuid: `uuid-${i}`,
  //           active: true,
  //           created_at: new Date(),
  //           updated_at: new Date(),
  //           status: getRandomStatus(),
  //           gross_amt: `100${i}`,
  //           tax_amt: `10${i}`,
  //           discount_amt: `5${i}`,
  //           legal_charges_amt: `15${i}`,
  //           net_amt: `80${i}`,
  //           inv_date: new Date(),
  //           inv_exp_date: new Date(new Date().setDate(new Date().getDate() + 30)),
  //           send_by: "email",
  //           to_origin_value: "USD",
  //           created_by: "admin",
  //           updated_by: "admin",
  //           subscription: `sub-${i}`,
  //           customer: {
  //               subscription: `sub-${i}`,
  //               type: "individual",
  //               first_name: `John-${i}`,
  //               last_name: `Doe-${i}`,
  //               company_name: null,
  //           },
  //           case_file: {

  //               name: `Case ${i}`,

  //           }
  //       };
  //       this.invoices.push(invoice);
  //     }

  // }

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

  openDialogPaymentRegister(){
    this.dialog.open(DialogPaymentRegisterComponent);
  }

}
