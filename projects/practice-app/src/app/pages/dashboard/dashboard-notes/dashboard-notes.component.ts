import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { CaseFileNote } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewNoteComponent } from '../../../components/dialogs/dialog-new-note/dialog-new-note.component';
import { HelpersService } from '../../../services/helpers.service';
import { PracticeService } from 'core-services';

@Component({
  selector: 'app-dashboard-notes',
  templateUrl: './dashboard-notes.component.html',
  styleUrls: ['./dashboard-notes.component.scss']
})
export class DashboardNotesComponent implements OnInit {

  totalCaseFileNotes!:number;
  @Input() caseFileNotes!:CaseFileNote[];
  displayedColumns: string[] = ['select', 'type' ,'title', 'description','customer', 'created_date', 'created_by','actions' ];
  dataSource = new MatTableDataSource<CaseFileNote>(this.caseFileNotes);
  selection = new SelectionModel<CaseFileNote>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog:MatDialog,
              private helperService:HelpersService,
              private practiceService:PracticeService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['caseFileNotes'] && changes['caseFileNotes'].currentValue){
      if(this.dataSource){
        this.dataSource.data = changes['caseFileNotes'].currentValue;
      }
    }
  }

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

  openDialogEditCaseFileNote(caseFileNote?:CaseFileNote){
    const dialogRef = this.dialog.open(DialogNewNoteComponent,{
      data: {
        caseFileNote: caseFileNote
      }
    });

    dialogRef.afterClosed().subscribe((result: {caseFileNote:CaseFileNote,createAnother:boolean}) => {
      if(result.caseFileNote.uuid){

        const caseFileNoteFiltered = this.caseFileNotes.filter(x => x.uuid === result.caseFileNote.uuid);

        if(caseFileNoteFiltered) this.caseFileNotes = this.caseFileNotes.filter(x => x.uuid !== result.caseFileNote.uuid);

        this.caseFileNotes.push(result.caseFileNote);
        this.ngAfterViewInit();

        if(result.createAnother) this.openDialogEditCaseFileNote();
      }

    });

  }

  deleteCaseFileNote(caseFileNote:CaseFileNote) {

    this.helperService.showConfirmationDeleteDialog().then((result) => {
      if (result.isConfirmed) {
        this.practiceService.deleteCaseFileNote(caseFileNote.subscription, caseFileNote.uuid || '').subscribe(
            {
              next: (data) => {
                  const arrayFiltered = this.caseFileNotes.filter(x => x.uuid !== caseFileNote.uuid);
                  this.caseFileNotes = arrayFiltered;
                  this.dataSource.data = this.caseFileNotes;

                  this.helperService.showMessageDeleted()
              },
              error: (err) => {
                this.helperService.showMessageErrorUnexpected()
              }
            }
        );
      }
    });

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
