import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { CaseFileNote } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewNoteComponent } from '../../../components/dialogs/dialog-new-note/dialog-new-note.component';

@Component({
  selector: 'app-dashboard-notes',
  templateUrl: './dashboard-notes.component.html',
  styleUrls: ['./dashboard-notes.component.scss']
})
export class DashboardNotesComponent implements OnInit {

  totalCaseFileNotes!:number;
  @Input() caseFileNotes!:CaseFileNote[];
  displayedColumns: string[] = ['select', 'type' ,'billNumber', 'status', 'expedient', 'created_by','action' ];
  dataSource = new MatTableDataSource<CaseFileNote>(this.caseFileNotes);
  selection = new SelectionModel<CaseFileNote>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
    this.dataSource.data = this.caseFileNotes
    this.totalCaseFileNotes = this.caseFileNotes.length
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDialogNewCaseFileNote(caseFileNote:CaseFileNote){
    this.dialog.open(DialogNewNoteComponent,{
      data: {
        caseFileNote
      }
    })
  }

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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


}
