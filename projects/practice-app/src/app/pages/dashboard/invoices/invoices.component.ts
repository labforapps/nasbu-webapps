import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  position: number;
  billNumber: number;
  status: string;
  expedient: string;
  date: Date;
  customer: string;
  amount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, billNumber: 5656, customer: 'Manuel', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date(), amount: 50000},
  {position: 2, billNumber: 5656, customer: 'Manuel', status: 'Vencida',   expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date(), amount: 50000},
  {position: 3, billNumber: 5656, customer: 'Manuel', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date(), amount: 50000},
  {position: 4, billNumber: 5656, customer: 'Manuel', status: 'Terminada', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date(), amount: 50000},
  {position: 5, billNumber: 5656, customer: 'Manuel', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date(), amount: 50000},
  {position: 6, billNumber: 5656, customer: 'Manuel', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date(), amount: 50000},
  {position: 7, billNumber: 5656, customer: 'Manuel', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date(), amount: 50000},
];

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
})

export class InvoicesComponent implements OnInit {
  public totalInvoices: number = 10;
  public totalAmountPending: number = 50000.00;
  displayedColumns: string[] = ['select', 'type' ,'billNumber', 'status', 'expedient', 'customer', 'date', 'payments', 'amount','action' ];
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
