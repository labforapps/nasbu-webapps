import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DialogUploadComponent } from '../../../../components/dialogs/dialog-upload/dialog-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { CaseFile, CaseFileDocument } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { PracticeService } from 'core-services';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSourceCaseFileDocuments!:any;
  selection = new SelectionModel<CaseFileDocument>(true, []);
  @Input() caseFile!:CaseFile;
  @ViewChild(MatPaginator) paginator: any;
  caseFilesDocuments!:CaseFileDocument[];


  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private translateService:TranslateService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCaseFileDocuments();
  }

  ngAfterViewInit(): void {
    this.displayedColumns = ['select', 'type','description', 'taskType', 'date', 'action'];
    this.dataSourceCaseFileDocuments = new MatTableDataSource<CaseFileDocument>(this.caseFilesDocuments);
    this.dataSourceCaseFileDocuments.paginator = this.paginator;
  }

  getCaseFileDocuments(){
   this.practiceService.getCaseFileDocuments(this.caseFile.subscription,this.caseFile.uuid || '').subscribe(data => {
    this.caseFilesDocuments = data;
    this.ngAfterViewInit();
   })
  }

  openDialogUpload(){
    const dialogRef = this.dialog.open(DialogUploadComponent,{
      data: {
        caseFile: this.caseFile
      }
    });

    dialogRef.afterClosed().subscribe((result: CaseFileDocument) => {
      if(result.uuid){
        this.caseFilesDocuments.push(result);
        this.ngAfterViewInit();
      }
    });

  }

  openNewTab(caseFileDocument:CaseFileDocument) {
    window.open(caseFileDocument.document, '_blank');
  }

  deleteCaseFileDocument(caseFileDocument:CaseFileDocument) {

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
          .deleteCaseFileDocuments(caseFileDocument.subscription, caseFileDocument.uuid || '')
          .subscribe(
            (data) => {

              const arrayFiltered = this.caseFilesDocuments.filter(x => x.uuid !== caseFileDocument.uuid);
              this.caseFilesDocuments = arrayFiltered;
              this.dataSourceCaseFileDocuments.data = this.caseFilesDocuments;

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
    const numRows = this.dataSourceCaseFileDocuments.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceCaseFileDocuments.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


}
