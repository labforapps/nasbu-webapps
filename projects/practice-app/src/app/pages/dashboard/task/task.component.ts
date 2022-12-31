import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  position: number;
  task: string;
  status: string;
  expedient: string;
  date: Date;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date()},
  {position: 2, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date()},
  {position: 3, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date()},
  {position: 4, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date()},
  {position: 5, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date()},
  {position: 6, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date()},
  {position: 7, task: 'Redacción de contrato de arrendamiento', status: 'Pendiente', expedient: 'NB0001-Contrato de servicio para la contratación de',  date: new Date()},

];

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit {
 public totalTasks: number = 10;
  displayedColumns: string[] = ['select', 'type','task', 'status', 'expedient', 'date', 'action'];
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
