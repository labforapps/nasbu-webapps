import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  position: number;
  name: string;
  number: string;
  email: string;
  rol: string;
  license : string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Irene Sánchez', number: '+1 (789) 378 27483', email: 'irene@nasbu.com',  rol: 'Abg. Paralegal', license: 'No aplica' },
  {position: 2, name: 'Irene Sánchez', number: '+1 (789) 378 27483', email: 'irene@nasbu.com',  rol: 'Abg. Paralegal', license: 'No aplica' },
  {position: 3, name: 'Irene Sánchez', number: '+1 (789) 378 27483', email: 'irene@nasbu.com',  rol: 'Abg. Paralegal', license: 'No aplica' },
  {position: 4, name: 'Irene Sánchez', number: '+1 (789) 378 27483', email: 'irene@nasbu.com',  rol: 'Abg. Paralegal', license: 'No aplica' },
  

];
@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {
  displayedColumns: string[] = ['select', 'type','name', 'number', 'email', 'rol','license', 'action'];
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
