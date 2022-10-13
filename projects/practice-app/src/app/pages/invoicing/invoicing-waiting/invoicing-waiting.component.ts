import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogPaymentHistoryComponent } from '../../../components/dialogs/dialog-payment-history/dialog-payment-history.component';
export interface PeriodicElement {
  position: number;
  number: number;
  status: string;
  expedient: string;
  client: string;
  date: string;
  payment: string;
  amount: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, number: 1, status: 'Pendiente', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral',  date: '23/9/22 ', payment:'Ver pagos', amount: '500USD'},
  {position: 2, number: 2, status: 'Pendiente', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral',  date: '23/9/22 ', payment:'Ver pagos', amount: '500USD'},
  {position: 3, number: 3, status: 'Pendiente', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral',  date: '23/9/22 ', payment:'Ver pagos', amount: '500USD'},
  {position: 4, number: 4, status: 'Pendiente', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral',  date: '23/9/22 ', payment:'Ver pagos', amount: '500USD'},
  {position: 5, number: 5, status: 'Pendiente', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral',  date: '23/9/22 ', payment:'Ver pagos', amount: '500USD'},
  {position: 6, number: 6, status: 'Pendiente', expedient: 'NB0001-Acta de divorcio', client: 'Manuel Cabral',  date: '23/9/22 ', payment:'Ver pagos', amount: '500USD'},


]
@Component({
  selector: 'app-invoicing-waiting',
  templateUrl: './invoicing-waiting.component.html',
  styleUrls: ['./invoicing-waiting.component.scss']
})
export class InvoicingWaitingComponent implements OnInit {
  displayedColumns: string[] = ['select', 'type','number', 'status', 'expedient', 'client', 'date', 'payment', 'amount', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  openDialogPaymentHistory(){
    this.dialog.open(DialogPaymentHistoryComponent);
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
