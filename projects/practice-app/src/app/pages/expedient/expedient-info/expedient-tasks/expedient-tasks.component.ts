import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewExpedientTaskComponent } from '../../../../components/dialogs/dialog-new-expedient-task/dialog-new-expedient-task.component';
export interface PeriodicElement {
  position: number;
  user: string;
  description: string;
  date: string;
  priority: string;
  state: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},
  {position: 2, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},
  {position: 3, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},
  {position: 4, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},
  {position: 5, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},
  {position: 6, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},
  {position: 7, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},
  {position: 8, description: 'Llamar a manuel pérez para erradicar los efectos preventivos ya vistos', user: 'Marcos Felix', date: '12/9/2021', priority: 'Normal', state: 'Pendiente'},


];
@Component({
  selector: 'app-expedient-tasks',
  templateUrl: './expedient-tasks.component.html',
  styleUrls: ['./expedient-tasks.component.scss']
})
export class ExpedientTasksComponent implements OnInit {
  displayedColumns: string[] = ['select','type','description', 'user', 'date', 'priority','state', 'action'];
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
  openDialogNewTask(){
    this.dialog.open(DialogNewExpedientTaskComponent);
  }


  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }

}
