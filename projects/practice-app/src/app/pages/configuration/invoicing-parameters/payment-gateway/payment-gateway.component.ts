import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddCreditcardComponent } from '../../../../components/dialogs/dialog-add-creditcard/dialog-add-creditcard.component';
import { SubscriptionPaymentMethod } from 'core-models';
import { DialogAddPaymentGatewayComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-add-payment-gateway/dialog-add-payment-gateway.component';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss']
})
export class PaymentGatewayComponent implements OnInit {

  displayedColumns: string[] = ['select','type', 'method','date', 'status', 'priority', 'action'];
  dataSource = new MatTableDataSource<SubscriptionPaymentMethod>([]);
  selection = new SelectionModel<SubscriptionPaymentMethod>(true, []);

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialogAddPaymentGateway(){
    this.dialog.open( DialogAddPaymentGatewayComponent);
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
    return '';
  }

}
