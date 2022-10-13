import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
export interface PeriodicElement {
  position: number;
  state: string;
  expedient: string;
  date: string;
  balance: string;
  

}
      
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1,state:'Pendiente de pago',  expedient: 'NB0001-Acta de divorcio', date: '12/9/2021', balance: '500 USD'},
  {position: 2,state:'Pendiente de pago',  expedient: 'NB0001-Acta de divorcio', date: '12/9/2021', balance: '500 USD'},
  {position: 3,state:'Pendiente de pago',  expedient: 'NB0001-Acta de divorcio', date: '12/9/2021', balance: '500 USD'},
  {position: 4,state:'Pendiente de pago',  expedient: 'NB0001-Acta de divorcio', date: '12/9/2021', balance: '500 USD'},
  {position: 5,state:'Pendiente de pago',  expedient: 'NB0001-Acta de divorcio', date: '12/9/2021', balance: '500 USD'},
  {position: 6,state:'Pendiente de pago',  expedient: 'NB0001-Acta de divorcio', date: '12/9/2021', balance: '500 USD'},
  {position: 7,state:'Pendiente de pago',  expedient: 'NB0001-Acta de divorcio', date: '12/9/2021', balance: '500 USD'},
  
  

];
@Component({
  selector: 'app-client-invoicing',
  templateUrl: './client-invoicing.component.html',
  styleUrls: ['./client-invoicing.component.scss']
})
export class ClientInvoicingComponent implements OnInit {
  displayedColumns: string[] = ['select','type','state','expedient', 'date', 'balance', 'action'];
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

  constructor() { }

  ngOnInit(): void {
  }

}
