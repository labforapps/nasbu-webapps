import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogNewNoteComponent } from '../../../../components/dialogs/dialog-new-note/dialog-new-note.component';
import { MatDialog } from '@angular/material/dialog';
import { CaseFile, CaseFileNote, CaseFileStatus } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { PracticeService } from '../../../../../../../core-services/src/lib/services/practice/practice.service';
import * as moment from 'moment';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSourceCaseFileNotes!:any;
  selection = new SelectionModel<CaseFileNote>(true, []);
  @ViewChild(MatPaginator) paginator: any;
  @Input() caseFile!:CaseFile;
  caseFileNotes!:CaseFileNote[];
  caseFileStatus = CaseFileStatus;

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private helperService:HelpersService) { }

  ngOnInit(): void {
    this.getCaseFileNotes();
  }

  ngAfterViewInit(): void {
    this.displayedColumns = ['select', 'type','title','description','client','date','action']
    this.dataSourceCaseFileNotes = new MatTableDataSource<CaseFileNote>(this.caseFileNotes);
    this.dataSourceCaseFileNotes.paginator = this.paginator;
  }

  getCaseFileNotes(){
   this.practiceService.getCaseFileNotes(this.caseFile.subscription,this.caseFile.uuid || '').subscribe(data => {
    this.caseFileNotes = data.sort((a, b) => {
      let dateA = new Date(a.created_at || '').getTime();
      let dateB = new Date(b.created_at || '').getTime();
      return dateB - dateA;
  });;;
    this.ngAfterViewInit();
   })
  }

  openDialogNewNote(caseFileNote?:CaseFileNote){
    const dialogRef = this.dialog.open(DialogNewNoteComponent,{
      data: {
        caseFile:this.caseFile,
        caseFileNote: caseFileNote
      }
    });

    dialogRef.afterClosed().subscribe((result: {caseFileNote:CaseFileNote,createAnother:boolean}) => {
      if(result.caseFileNote.uuid){

        const caseFileNoteFiltered = this.caseFileNotes.filter(x => x.uuid === result.caseFileNote.uuid);

        if(caseFileNoteFiltered) this.caseFileNotes = this.caseFileNotes.filter(x => x.uuid !== result.caseFileNote.uuid);

        this.caseFileNotes.push(result.caseFileNote);
        this.ngAfterViewInit();

        if(result.createAnother) this.openDialogNewNote();
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
                  this.dataSourceCaseFileNotes.data = this.caseFileNotes;

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

  returnDateFormatted(dateCaseFileNote: string) {
    const date = moment(dateCaseFileNote);
    const formattedDate = date.locale('es').format('D MMM. YYYY');

    return formattedDate;
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceCaseFileNotes ? this.dataSourceCaseFileNotes.data.length : 0;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceCaseFileNotes.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


}
