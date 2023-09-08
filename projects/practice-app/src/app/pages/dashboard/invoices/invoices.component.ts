import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { Invoice, InvoiceStatus } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogPaymentHistoryComponent } from '../../../components/dialogs/dialog-payment-history/dialog-payment-history.component';
import { DialogSendInvoiceComponent } from '../../../components/dialogs/dialog-send-invoice/dialog-send-invoice.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
})

export class InvoicesComponent implements OnInit {

  public totalInvoices: number = 10;
  public totalAmountPending: number = 50000.00;
  private invoiceStatus = InvoiceStatus;
  @Input() invoices!:Invoice[];
  displayedColumns: string[] = ['select', 'type' ,'billNumber', 'status', 'expedient', 'customer', 'date', 'payments', 'amount','action' ];
  dataSource = new MatTableDataSource<Invoice>(this.invoices);
  selection = new SelectionModel<Invoice>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private matDialog:MatDialog) { }

  ngOnInit(): void {
    this.dataSource.data = this.invoices.filter(x => x.status === this.invoiceStatus.PENDING).slice(0,10).sort((a, b) => {
      let dateA = new Date(a.inv_date || '').getTime();
      let dateB = new Date(b.inv_date || '').getTime();
      return dateA - dateB;
  });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDialogPaymentHistory(invoice:Invoice){
    this.matDialog.open(DialogPaymentHistoryComponent,{
      data: {
        invoice
      }
    })
  }

  openDialogSendInvoice(invoice:Invoice) {
    this.matDialog.open(DialogSendInvoiceComponent,{
      data: {
        invoice
      }
    });
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
