import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-expedient-table',
  templateUrl: './expedient-table.component.html',
  styleUrls: ['./expedient-table.component.scss']
})
export class ExpedientTableComponent implements OnInit {

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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
}
