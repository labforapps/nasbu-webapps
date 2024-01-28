import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice, InvoiceStatus, invoiceStatusDescription } from 'core-models';
import { AccountingService } from 'core-services';
import { DialogPaymentHistoryComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-payment-history/dialog-payment-history.component';
import { DialogPaymentRegisterComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-payment-register/dialog-payment-register.component';
import { DialogPaymentRequestComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-payment-request/dialog-payment-request.component';
import { DialogSendInvoiceComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-send-invoice/dialog-send-invoice.component';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-invoicing-table',
  templateUrl: './invoicing-table.component.html',
  styleUrls: ['./invoicing-table.component.scss']
})
export class InvoicingTableComponent implements OnInit {

  @Input() invoices!:Invoice[];
  @Input() inputInvoiceStatus!:InvoiceStatus;
  public invoiceStatus = InvoiceStatus;
  displayedColumns: string[] = ['select','type','number','status','expedient','client','date','payments','delay','amount','action'];
  dataSource = new MatTableDataSource<Invoice>(this.invoices);
  selection = new SelectionModel<Invoice>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() onExecuteInvoice = new EventEmitter<any>();
  invoiceStatusDescription = invoiceStatusDescription;

  constructor(public dialog: MatDialog,
              private helperService:HelpersService,
              private accountingService:AccountingService) {}

  ngOnInit(): void {
    this.dataSource.data = this.invoices;

    if(this.inputInvoiceStatus !== this.invoiceStatus.EXPIRED) this.hideDelaysColumn();
    if(this.inputInvoiceStatus !== this.invoiceStatus.PENDING && this.inputInvoiceStatus !== this.invoiceStatus.PAYED) this.hidePaymentsColumn();

    this.dataSource.filterPredicate = (data: Invoice, filter: string): boolean => {
      let searchableString = '';

      if (data.customer) {
        searchableString += data.customer.first_name ? data.customer.first_name : '';
        searchableString += data.customer.last_name ? data.customer.last_name : '';
        searchableString += data.customer.company_name ? data.customer.company_name : '';
      }

      return searchableString.toLowerCase().includes(filter);
    };


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoices'] && changes['invoices'].currentValue) {
      this.dataSource.data = this.invoices;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  searchByName(filterValue: any) {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  hidePaymentsColumn(){
    this.displayedColumns = this.displayedColumns.filter(x => x != 'payments')
  }

  hideDelaysColumn(){
    this.displayedColumns = this.displayedColumns.filter(x => x != 'delay')
  }

  openDialogRegisterPayment(invoice:Invoice){
    const dialogRef = this.dialog.open(DialogPaymentRegisterComponent,{
      data: {
        invoice
      }
    });

    dialogRef.afterClosed().subscribe((result:Invoice) => {
      this.onExecuteInvoice.emit({})
    });

  }

  openDialogSendInvoice(invoice:Invoice) {
    this.dialog.open(DialogSendInvoiceComponent,{
      data: {
        invoice
      }
    });
  }

  openDialogPaymentHistory(invoice:Invoice){
    const dialogRef = this.dialog.open(DialogPaymentHistoryComponent,{
      data: {
        invoice
      }
    });

    dialogRef.afterClosed().subscribe((result:Invoice) => {
      this.onExecuteInvoice.emit({})
    });
  }

  deleteInvoice(invoice:Invoice){
    this.helperService.showConfirmationDeleteDialog().then( (result) => {
      if(result.isConfirmed){
        this.accountingService.deleteInvoice(invoice.subscription,invoice.uuid || '').subscribe(data => {
          this.onExecuteInvoice.emit({})
          this.helperService.showMessageDeleted();
        })
      }
    })
  }

  openDialogRequestPayment(invoice:Invoice){
    const dialogRef = this.dialog.open(DialogPaymentRequestComponent,{
      data: {
        invoice
      }
    });
    dialogRef.afterClosed().subscribe((result:Invoice) => {
      this.onExecuteInvoice.emit({})
    });
  }

  returnInvoiceStatusDescription(value:string){
    return this.invoiceStatusDescription.get(value);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

}
