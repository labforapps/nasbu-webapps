import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogNewNoteComponent } from '../../../../components/dialogs/dialog-new-note/dialog-new-note.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  position: number;
  title: string;
  description: string;
  date: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, title: 'Manifiesto Pago Maria Claudia', description: 'Durante la primera sesión ana Mendez hizo la observación de que había tomado',  date: '12/9/2021'},
  {position: 2, title: 'Manifiesto Pago Maria Claudia', description: 'Durante la primera sesión ana Mendez hizo la observación de que había tomado',  date: '12/9/2021'},
  {position: 3, title: 'Manifiesto Pago Maria Claudia', description: 'Durante la primera sesión ana Mendez hizo la observación de que había tomado',  date: '12/9/2021'},
  {position: 4, title: 'Manifiesto Pago Maria Claudia', description: 'Durante la primera sesión ana Mendez hizo la observación de que había tomado',  date: '12/9/2021'},
  {position: 5, title: 'Manifiesto Pago Maria Claudia', description: 'Durante la primera sesión ana Mendez hizo la observación de que había tomado',  date: '12/9/2021'},
  {position: 6, title: 'Manifiesto Pago Maria Claudia', description: 'Durante la primera sesión ana Mendez hizo la observación de que había tomado',  date: '12/9/2021'},


];
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  displayedColumns: string[] = ['select','type','title','description', 'date', 'action'];
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
  openDialogNewNote(){
    this.dialog.open(DialogNewNoteComponent);
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
