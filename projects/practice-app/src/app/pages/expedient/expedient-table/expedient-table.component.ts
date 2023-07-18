import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { CaseFile,Customer, SecurityUser, TypeCustomer } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { PracticeService } from 'core-services';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogNewExpedientComponent } from '../../../components/dialogs/dialog-new-expedient/dialog-new-expedient.component';
import Swal from 'sweetalert2';
import { DialogUsersShareExpedientComponent } from '../../../components/dialogs/dialog-users-share-expedient/dialog-users-share-expedient.component';
@Component({
  selector: 'app-expedient-table',
  templateUrl: './expedient-table.component.html',
  styleUrls: ['./expedient-table.component.scss']
})
export class ExpedientTableComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSourceCaseFiles!:any;
  selection = new SelectionModel<CaseFile>(true, []);
  @Input() caseFiles!:CaseFile[];
  @Input() customers!:Customer[];
  @Input() securityUsers!:SecurityUser[];
  caseFilesCopy!:CaseFile[];
  @ViewChild(MatPaginator) paginator: any;
  startDateFilter!:string | null;
  endDateFilter!:string | null;
  typeCustomer = TypeCustomer;
  filters: {customer?:string,assignTo?:string,status?:string,shared_with?:string} = {}

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private translateService:TranslateService,
              private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.caseFilesCopy = this.caseFiles;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['caseFiles'] && changes['caseFiles'].currentValue) {
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit(): void {
    this.displayedColumns = ['select', 'type','description','assigned_to','client', 'update', 'share','action']
    this.dataSourceCaseFiles = new MatTableDataSource<CaseFile>(this.caseFiles);
    this.dataSourceCaseFiles.paginator = this.paginator;
  }

  returnDateFormatted(dateCaseFile: string) {
    const date = moment(dateCaseFile);
    const formattedDate = date.locale('es').format('D MMM. YYYY');

    return formattedDate;
  }

  searchByName(filterValue: any) {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceCaseFiles.filter = filterValue;
  }

  onSelectDatesFilter(value:string, typeDate: 'S' | 'E') {

    this.caseFiles = this.caseFilesCopy;

    if(typeDate === 'S' && value) this.startDateFilter = new Date(value).toISOString();
    if(typeDate === 'E' && value) this.endDateFilter = new Date(value).toISOString();
    if(typeDate === 'S' && !value) this.startDateFilter = '';
    if(typeDate === 'E' && !value) this.endDateFilter = '';

   if(this.startDateFilter && !this.endDateFilter){
    this.caseFiles = this.caseFiles.filter(x => x.created_at && this.startDateFilter && x.created_at >= this.startDateFilter);
   }
   else if(!this.startDateFilter && this.endDateFilter){
    this.caseFiles = this.caseFiles.filter(x => x.created_at && this.endDateFilter && x.created_at <= this.endDateFilter);
   }
   else if(this.startDateFilter && this.endDateFilter){
    this.caseFiles = this.caseFiles.filter(x => x.created_at && this.endDateFilter && this.startDateFilter
      && x.created_at >= this.startDateFilter && x.created_at <= this.endDateFilter);
   }

   this.ngAfterViewInit();

  }

  applyFilters(){

    this.caseFiles = this.caseFilesCopy;

    if(this.filters.customer){
      this.caseFiles = this.caseFiles.filter(x => x.customer.uuid === this.filters.customer)
    }
    if(this.filters.assignTo){
      this.caseFiles = this.caseFiles.filter(x => x.assigned_to.uuid === this.filters.assignTo)
    }

    this.ngAfterViewInit();

  }

  openDialogNewExpedient(caseFile:CaseFile){

    const dialogRef = this.dialog.open(DialogNewExpedientComponent,{data:{caseFile}});

    dialogRef.afterClosed().subscribe((result:CaseFile) => {

      if(result.uuid){
        const caseFileFiltered = this.caseFiles.filter(x => x.uuid === result.uuid);
        if(caseFileFiltered){
          this.caseFiles = this.caseFiles.filter(x => x.uuid !== result.uuid);
          this.caseFiles.push(result);
          this.ngAfterViewInit();
        }
      }
    });

  }

  openDialogUserShareExpedient(caseFile:CaseFile){
    const dialogRef = this.dialog.open(DialogUsersShareExpedientComponent,{
      data: {
          users: this.securityUsers,
          caseFile:caseFile
      }
    });
  }

  deleteCaseFile(caseFile:CaseFile){
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
          .deleteCaseFile(caseFile.subscription, caseFile.uuid || '')
          .subscribe(
            (data) => {

              const arrayFiltered = this.caseFiles.filter(x => x.uuid !== caseFile.uuid);
              this.caseFiles = arrayFiltered;
              this.dataSourceCaseFiles.data = this.caseFiles;

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceCaseFiles.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceCaseFiles.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
