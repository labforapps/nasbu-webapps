import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Payment, paymentMethodDescription } from 'core-models';
import { AccountingService } from 'core-services';
import { DialogSendPaymentComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-send-payment/dialog-send-payment.component';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
})
export class PaymentsTableComponent implements OnInit, OnChanges {

  @Input() payments!: Payment[];
  @Input() selectedSubscriptionId!: string;
  @Output() onExecutePayment = new EventEmitter<any>();

  displayedColumns: string[] = ['select', 'date', 'invoice', 'client', 'method', 'amount', 'action'];
  dataSource = new MatTableDataSource<Payment>();
  selection = new SelectionModel<Payment>(true, []);
  paymentMethodDescription = paymentMethodDescription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private accountingService: AccountingService,
    private helperService: HelpersService,
  ) {}

  ngOnInit(): void {
    this.dataSource.data = this.payments;
    this.dataSource.filterPredicate = (data: Payment, filter: string): boolean => {
      let searchableString = '';
      if (data.customer) {
        searchableString += data.customer.first_name ?? '';
        searchableString += data.customer.last_name ?? '';
        searchableString += data.customer.company_name ?? '';
      }
      return searchableString.toLowerCase().includes(filter);
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payments'] && this.payments) {
      this.dataSource.data = this.payments;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  searchByName(event: any): void {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Payment): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  openDialogSendPayment(payment: Payment): void {
    this.dialog.open(DialogSendPaymentComponent, {
      data: { payment },
      disableClose: true,
    });
  }

  deletePayment(payment: Payment): void {
    this.accountingService.deletePayment(this.selectedSubscriptionId, payment.uuid).subscribe(() => {
      this.helperService.showMessageDeleted();
      this.onExecutePayment.emit();
    });
  }
}
