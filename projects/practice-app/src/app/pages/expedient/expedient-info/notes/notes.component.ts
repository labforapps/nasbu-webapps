import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogNewNoteComponent } from '../../../../components/dialogs/dialog-new-note/dialog-new-note.component';
import { MatDialog } from '@angular/material/dialog';
import { CaseFile, CaseFileNote } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { PracticeService } from '../../../../../../../core-services/src/lib/services/practice/practice.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';
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

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private cdr: ChangeDetectorRef,
              private translateService:TranslateService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCaseFileNotes();
  }

  ngAfterViewInit(): void {
    this.displayedColumns = ['select', 'type','title','description','date','action']
    this.dataSourceCaseFileNotes = new MatTableDataSource<CaseFileNote>(this.caseFileNotes);
    this.dataSourceCaseFileNotes.paginator = this.paginator;
  }

  getCaseFileNotes(){
   this.practiceService.getCaseFileNotes(this.caseFile.subscription,this.caseFile.uuid || '').subscribe(data => {
    this.caseFileNotes = data;
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

        if(caseFileNoteFiltered){
          this.caseFileNotes = this.caseFileNotes.filter(x => x.uuid !== result.caseFileNote.uuid);
          this.caseFileNotes.push(result.caseFileNote);
          this.ngAfterViewInit();
        }
        else{
          this.caseFileNotes.push(result.caseFileNote);
          this.ngAfterViewInit();
        }

        if(result.createAnother) this.openDialogNewNote();

      }

    });

  }

  deleteCaseFileNote(caseFileNote:CaseFileNote) {

    Swal.fire({
      title: this.translateService.instant(
        'clients.table.buttons.confirm_question_delete'
      ),
      text: this.translateService.instant(
        'clients.table.buttons.actions_cannot_be_reversed'
      ),
      iconHtml: '<img src="assets/images/alert-delete.svg">',
      confirmButtonText: this.translateService.instant(
        'clients.table.buttons.delete'
      ),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant(
        'clients.client_intake.close_window'
      ),
      customClass: {
        popup: 'c-alert c-alert--delete',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.practiceService
          .deleteCaseFileNote(caseFileNote.subscription, caseFileNote.uuid || '')
          .subscribe(
            (data) => {

              const arrayFiltered = this.caseFileNotes.filter(x => x.uuid !== caseFileNote.uuid);
              this.caseFileNotes = arrayFiltered;
              this.dataSourceCaseFileNotes.data = this.caseFileNotes;

              this.toastr.success(
                'Ok',
                this.translateService.instant(
                  'successMessages.deleted_successfully'
                )
              );
            },
            (error) => {
              this.toastr.error(
                'Error',
                this.translateService.instant('errorMessages.unexpectedError')
              );
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
