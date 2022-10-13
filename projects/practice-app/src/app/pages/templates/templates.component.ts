import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogNewDocumentComponent }
from '../../components/dialogs/dialog-new-document/dialog-new-document.component';
import { DialogNewTemplateComponent } from '../../components/dialogs/dialog-new-template/dialog-new-template.component';
export interface PeriodicElement {
  position: number;
  description: string;
  taskType: string;
  date: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, description: 'Acta de asamblea constitutiva', taskType: 'PDF',  date: '23/9/22 '},
  {position: 1, description: 'Carta dirigida al tribunal superior 29 Abril 2019', taskType: 'Word microsoft',  date: '23/9/22 '},
  {position: 1, description: 'Carta dirigida al tribunal superior 29 Abril 2019', taskType: 'Word microsoft',  date: '23/9/22 '},
  {position: 1, description: 'Acta de asamblea constitutiva', taskType: 'Word microsoft',  date: '23/9/22 '},
  {position: 1, description: 'Carta dirigida al tribunal superior 29 Abril 2019', taskType: 'PDF',  date: '23/9/22 '},
  {position: 1, description: 'Carta dirigida al tribunal superior 29 Abril 2019', taskType: 'Word microsoft',  date: '23/9/22 '},
  {position: 1, description: 'Acta de asamblea constitutiva', taskType: 'PDF',  date: '23/9/22 '},


];
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {
  displayedColumns: string[] = ['select', 'type','description', 'taskType', 'date', 'action'];
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

  openDialogNewDocument(){
    this.dialog.open(DialogNewDocumentComponent);
  }

  openDialogNewTemplate(){
    this.dialog.open(DialogNewTemplateComponent);
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
