import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewTaskComponent } from '../../components/dialogs/dialog-new-task/dialog-new-task.component';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogChargedHoursComponent } from '../../components/dialogs/dialog-charged-hours/dialog-charged-hours.component';
import { DialogNewReasonComponent } from '../../components/dialogs/dialog-new-reason/dialog-new-reason.component';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  position: number;
  rason: string;
  client: string;
  expedient: string;
  hours: string;
  date: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},
  {position: 2, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},
  {position: 3, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},
  {position: 4, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},
  {position: 5, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},
  {position: 6, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},
  {position: 7, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},
  {position: 8, rason: 'Tomar notas caso choque de arrendamiento', client: 'Manuel Cabral', expedient: 'NB0001-Contrato de servicio para la contratación de', hours:'5 Hr.', date: '23/9/22 '},

];

@Component({
  selector: 'app-taskpage',
  templateUrl: './taskpage.component.html',
  styleUrls: ['./taskpage.component.scss']
})
export class TaskpageComponent implements OnInit {
  displayedColumns: string[] = ['select', 'type','rason', 'client', 'expedient', 'hours', 'date', 'action'];
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
    this.dialog.open(DialogNewTaskComponent);
  }
  openDialogNewReason(){
    this.dialog.open(DialogNewReasonComponent);
  }
  openDialogChargedHours(){
    this.dialog.open(DialogChargedHoursComponent);
  }
  openAlertDelete(){
    Swal.fire({
      title: '¿Deseas eliminar este elemento?',
      text: 'Esta acción no se podrá revertir',
      iconHtml: '<img src="assets/images/alert-delete.svg">',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText:'Cerrar ventana',
      customClass:{
        popup: 'c-alert c-alert--delete'
      }
    })
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
