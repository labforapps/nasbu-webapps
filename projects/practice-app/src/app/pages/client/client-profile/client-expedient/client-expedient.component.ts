import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogNewExpedientComponent } from '../../../../components/dialogs/dialog-new-expedient/dialog-new-expedient.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'

export interface PeriodicElement {
  position: number;
  description: string;
  case: string;
  client: string;
  update: string;
  share: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, description: 'NB0001-Acta de divorcio', case: 'Marcos Felix', client: 'Manuel Cabral', update: '12/9/2021 ', share:'Sin compartir'},
  {position: 2, description: 'NB0001-Acta de divorcio', case: 'Marcos Felix', client: 'Manuel Cabral', update: '12/9/2021 ', share:'Sin compartir'},
  {position: 3, description: 'NB0001-Acta de divorcio', case: 'Marcos Felix', client: 'Manuel Cabral', update: '12/9/2021 ', share:'Sin compartir'},
  {position: 4, description: 'NB0001-Acta de divorcio', case: 'Marcos Felix', client: 'Manuel Cabral', update: '12/9/2021 ', share:'Sin compartir'},
  {position: 5, description: 'NB0001-Acta de divorcio', case: 'Marcos Felix', client: 'Manuel Cabral', update: '12/9/2021 ', share:'Sin compartir'},
  {position: 6, description: 'NB0001-Acta de divorcio', case: 'Marcos Felix', client: 'Manuel Cabral', update: '12/9/2021 ', share:'Sin compartir'},
  {position: 7, description: 'NB0001-Acta de divorcio', case: 'Marcos Felix', client: 'Manuel Cabral', update: '12/9/2021 ', share:'Sin compartir'},

];

@Component({
  selector: 'app-client-expedient',
  templateUrl: './client-expedient.component.html',
  styleUrls: ['./client-expedient.component.scss']
})
export class ClientExpedientComponent implements OnInit {
  displayedColumns: string[] = ['select', 'type','description','case', 'client', 'update', 'share','action'];
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
  openDialogNewExpedient(){
    this.dialog.open(DialogNewExpedientComponent);
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

