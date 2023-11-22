import { Component, Input, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddCreditcardComponent } from '../../../../components/dialogs/dialog-add-creditcard/dialog-add-creditcard.component';
import { Observable } from 'rxjs';
import { Subscription, SubscriptionPaymentMethod } from 'core-models';
import { SubscriptionService } from 'core-services';

export interface PeriodicElement {
  position: number;
  date: string;
  status: string;
  priority: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 2, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 3, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 4, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 5, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 6, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},
  {position: 7, date: '13 / 02 / 22', status: 'Disponible ', priority: 'Principal'},

];

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  displayedColumns: string[] = ['select', 'method','date', 'status', 'priority', 'action'];
  dataSource = new MatTableDataSource<SubscriptionPaymentMethod>([]);
  selection = new SelectionModel<SubscriptionPaymentMethod>(true, []);

  @Input()
  subscription!: Subscription;

  paymentMethods$!: Observable<SubscriptionPaymentMethod[]>;
  paymentMethods!: SubscriptionPaymentMethod[];

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
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return '';
  }

  openDialogAddCreditcard(){
    this.dialog.open( DialogAddCreditcardComponent);
  }

  constructor(public dialog: MatDialog,
              private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
      this.fetchPaymentMethods();
  }

  fetchPaymentMethods() {
      if (this.subscription) {
        this.subscriptionService
        .getSubscriptionPaymentMethods(this.subscription.uuid)
        .subscribe((paymentMethods: SubscriptionPaymentMethod[]) => {
              this.paymentMethods = paymentMethods;
              this.dataSource.data = paymentMethods;
        });
      }

  }

}
