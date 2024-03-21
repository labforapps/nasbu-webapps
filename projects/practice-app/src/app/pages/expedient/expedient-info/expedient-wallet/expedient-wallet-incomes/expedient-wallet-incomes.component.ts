import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogPaymentRegisterComponent } from '../../../../../components/dialogs/dialog-payment-register/dialog-payment-register.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddBalanceComponent } from '../../../../../components/dialogs/dialog-add-balance/dialog-add-balance.component';
export interface PeriodicElement {
  position: number;
  expedient: string;
  task: string;
  date: string;
  hours: string;
  value: string;
  amount: string


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, expedient: 'NB0001-Acta de divorcio', task: 'Llamada Manuel Cabral', date: '12/9/2021', hours: '2 Horas', value: '250 USD', amount: '-500 USD'},
  {position: 2, expedient: 'NB0001-Acta de divorcio', task: 'Llamada Manuel Cabral', date: '12/9/2021', hours: '2 Horas', value: '250 USD', amount: '-500 USD'},
  {position: 3, expedient: 'NB0001-Acta de divorcio', task: 'Llamada Manuel Cabral', date: '12/9/2021', hours: '2 Horas', value: '250 USD', amount: '-500 USD'},
  {position: 4, expedient: 'NB0001-Acta de divorcio', task: 'Llamada Manuel Cabral', date: '12/9/2021', hours: '2 Horas', value: '250 USD', amount: '-500 USD'},
  {position: 5, expedient: 'NB0001-Acta de divorcio', task: 'Llamada Manuel Cabral', date: '12/9/2021', hours: '2 Horas', value: '250 USD', amount: '-500 USD'},
  {position: 6, expedient: 'NB0001-Acta de divorcio', task: 'Llamada Manuel Cabral', date: '12/9/2021', hours: '2 Horas', value: '250 USD', amount: '-500 USD'},




];

@Component({
  selector: 'app-expedient-wallet-incomes',
  templateUrl: './expedient-wallet-incomes.component.html',
  styleUrls: ['./expedient-wallet-incomes.component.scss']
})
export class ExpedientWalletIncomesComponent implements OnInit {

  displayedColumns: string[] = ['select','type','expedient','task', 'date', 'hours','value','amount', 'action'];
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

  openDialogPaymentRegister(){
    this.dialog.open(DialogPaymentRegisterComponent);
  }


  openDialogAddBalance(){
    this.dialog.open(DialogAddBalanceComponent);
  }

  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }


}
