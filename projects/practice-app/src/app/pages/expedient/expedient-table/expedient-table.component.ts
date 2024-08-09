import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { CaseFile,CaseFileAccess,CaseFileStatus,Customer, CustomerCaseFile, SecurityUser, TypeCustomer, UserCaseFile, modules } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { PracticeService } from 'core-services';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogNewExpedientComponent } from '../../../components/dialogs/dialog-new-expedient/dialog-new-expedient.component';
import Swal from 'sweetalert2';
import { DialogUsersShareExpedientComponent } from '../../../components/dialogs/dialog-users-share-expedient/dialog-users-share-expedient.component';
import { Router } from '@angular/router';
import { StateService } from '../../../services/state.service';
@Component({
  selector: 'app-expedient-table',
  templateUrl: './expedient-table.component.html',
  styleUrls: ['./expedient-table.component.scss']
})
export class ExpedientTableComponent implements OnInit {

  @Input() public module!:modules;
  @Input() customer!:Customer;
  @Input() securityUser!:SecurityUser;
  @Output() onExecuteExpedient = new EventEmitter<any>();
  moduleEnum = modules;
  displayedColumns: string[] = [];
  dataSourceCaseFiles!:MatTableDataSource<CaseFile>;
  selection = new SelectionModel<CaseFile>(true, []);
  @Input() caseFiles!:CaseFile[];
  @Input() customers!:Customer[];
  customersWithCaseFile!:CustomerCaseFile[] | null;
  @Input() securityUsers!:SecurityUser[];
  securityUsersWithCaseFile!:UserCaseFile[] | null;
  securityUsersWithCaseFileAccess!:SecurityUser[];
  caseFilesCopy!:CaseFile[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  startDateFilter!:Date | null;
  endDateFilter!:Date | null;
  typeCustomer = TypeCustomer;
  filters: {customer?:string,assignTo?:string,status?:string,shared_with?:string} = {};
  caseFileStatus = CaseFileStatus;
  focusStartDateFilter!:Boolean;
  focusEndDateFilter!:Boolean

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private translateService:TranslateService,
              private toastr: ToastrService,
              private router:Router,
              private stateService:StateService ) { }

  ngOnInit(): void {

    this.caseFilesCopy = this.caseFiles;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['caseFiles'] && changes['caseFiles'].currentValue) {
      this.caseFilesCopy = this.caseFiles;
    }

    if (changes['securityUsers'] && changes['securityUsers'].currentValue) {
      this.setUsersWithCaseFile();
      this.setUsersWithAccessToCaseFiles()
    }

    if (changes['customers'] && changes['customers'].currentValue) {
      this.setCustomersWithCaseFile();
    }

    this.ngAfterViewInit();

  }

  ngAfterViewInit(): void {
    this.displayedColumns = ['select', 'type','description','assigned_to','client', 'update', 'share','action']
    this.dataSourceCaseFiles = new MatTableDataSource<CaseFile>(this.caseFiles);

    const savedState = this.stateService.getPaginatorState();

    if (savedState) {
      this.paginator.pageIndex = savedState.pageIndex;
      this.paginator.pageSize = savedState.pageSize;
    }

    this.dataSourceCaseFiles.paginator = this.paginator;

  }

  returnDateFormatted(dateCaseFile: string) {
    const date = moment(dateCaseFile);
    const formattedDate = date.locale('es').format('D MMM. YYYY');

    return formattedDate;
  }

  setCustomersWithCaseFile(){
    if( this.customers &&  this.customers.length > 0){
      let uniqueCustomers: { [uuid: string]: CustomerCaseFile } = {};
      this.caseFilesCopy.forEach(caseFile => {
        let customer = caseFile.customer;
        if (customer && customer.uuid && !uniqueCustomers[customer.uuid]) {
          uniqueCustomers[customer.uuid] = customer;
      }
    });

      this.customersWithCaseFile = Object.values(uniqueCustomers).sort((a, b) => {
        const companyNameA = a.company_name || '';
        const companyNameB = b.company_name || '';

        const nameA = a.type === this.typeCustomer.person && companyNameA === '' ? a.first_name.toLowerCase() : companyNameA.toLowerCase();
        const nameB = b.type === this.typeCustomer.person && companyNameB === '' ? b.first_name.toLowerCase() : companyNameB.toLowerCase();

        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });

    }

    return [];
  }

  setUsersWithCaseFile() {
    if( this.securityUsers && this.securityUsers.length > 0){
      let uniqueUsers: { [key: string]: { user: UserCaseFile, uuid: string | undefined } } = {};
      this.caseFilesCopy.forEach(caseFile => {
        let user = caseFile.assigned_to?.user;
        let uuid = caseFile.assigned_to?.uuid;
        if (user && user.email && !uniqueUsers[user.email]) {
          uniqueUsers[user.email] = { user: user, uuid: uuid };
        }
      });

      this.securityUsersWithCaseFile =  Object.values(uniqueUsers).map(({user, uuid}) => ({...user, uuid})).sort((a, b) => {

        const nameA = a.first_name;
        const nameB = b.first_name;

        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });;
    }

    return [];
  }

  setUsersWithAccessToCaseFiles() {
    let usersWithAccess: SecurityUser[] = [];

    this.caseFilesCopy.forEach(caseFile => {
      if (caseFile.case_file_user_access) {
        caseFile.case_file_user_access.forEach(caseFileAccess => {
          let user = this.securityUsers.find(user => user.uuid === caseFileAccess.subscription_user);
          if (user && !usersWithAccess.some(u => user && u.uuid === user.uuid)) {
            usersWithAccess.push(user);
          }
        });
      }
    });

    this.securityUsersWithCaseFileAccess = usersWithAccess.sort((a, b) => {

      const nameA = a.user.first_name;
      const nameB = b.user.first_name;

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }



  searchByName(filterValue: any) {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceCaseFiles.filter = filterValue;
  }

  onSelectDatesFilter(value:string, typeDate: 'S' | 'E') {

    this.caseFiles = this.caseFilesCopy;

    if(typeDate === 'S' && value) this.startDateFilter = new Date(value);
    if(typeDate === 'E' && value) this.endDateFilter = new Date(value);
    if(typeDate === 'S' && !value) this.startDateFilter = null;
    if(typeDate === 'E' && !value) this.endDateFilter = null;

    const start = new Date(this.startDateFilter || '');
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const end = new Date(this.endDateFilter || '');
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    if(this.startDateFilter && this.endDateFilter){
      this.caseFiles = this.caseFiles.filter(x => {
        if(x.created_at) {
          const createdDate = new Date(x.created_at);
          const created = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
          return created >= startDate && created <= endDate;
        }
        return false;
      });
    }

    else if(this.startDateFilter && !this.endDateFilter){
      this.caseFiles = this.caseFiles.filter(x => {
        if(x.created_at) {
          const createdDate = new Date(x.created_at);
          const created = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
          return created >= startDate;
        }
        return false;
      });
    }
    else if(!this.startDateFilter && this.endDateFilter){
      this.caseFiles = this.caseFiles.filter(x => {
        if(x.created_at) {
          const createdDate = new Date(x.created_at);
          const created = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
          return created <=  endDate;
        }
        return false;
      });
    }

   this.ngAfterViewInit();

  }

  onInputFocus(type:string) {
   if(type === 'S') this.focusStartDateFilter = true;
   if(type === 'E') this.focusEndDateFilter = true;
  }

  onInputBlur(type:string) {
    if(type === 'S') this.focusStartDateFilter = false;
    if(type === 'E') this.focusEndDateFilter = false;
  }

  cleanDatesFilter(){
    this.startDateFilter = null;
    this.endDateFilter = null;
    this.caseFiles = this.caseFilesCopy;
    this.dataSourceCaseFiles.data = this.caseFiles;
  }

  applyFilters(){

    this.caseFiles = this.caseFilesCopy;

    if(this.filters.customer){
      this.caseFiles = this.caseFiles.filter(x => x.customer.uuid === this.filters.customer)
    }
    if(this.filters.assignTo){
      this.caseFiles = this.caseFiles.filter(x => x.assigned_to.uuid === this.filters.assignTo)
    }

    if(this.filters.status === this.caseFileStatus.OPEN || this.filters.status === this.caseFileStatus.CLOSED){
      this.caseFiles = this.caseFiles.filter(x => x.status === this.filters.status)
    }

    if(this.filters.shared_with){
      this.caseFiles = this.caseFiles.filter(x => {
        if (x.case_file_user_access) {
          return x.case_file_user_access.some(access => access.subscription_user === this.filters.shared_with);
        }
        return false;
      });
    }

    this.ngAfterViewInit();

  }

  cleanFilters(){
    this.filters = {};
    this.caseFiles = this.caseFilesCopy;
    this.ngAfterViewInit();
  }

  openDialogNewExpedient(caseFile?:CaseFile){

    const dialogRef = this.dialog.open(DialogNewExpedientComponent,{data:{caseFile: caseFile, customer: this.customer, securityUser: this.securityUser}});

    dialogRef.afterClosed().subscribe((result:CaseFile) => {

      if(result.uuid){
          this.onExecuteExpedient.emit()
          this.ngAfterViewInit();
      }
    });

  }

  openDialogUserShareExpedient(caseFile:CaseFile){
    this.dialog.open(DialogUsersShareExpedientComponent,{
      data: {
          users: this.securityUsers,
          caseFile:caseFile
      }
    });
  }

  returnSharedUserName(caseFileAccess:CaseFileAccess[]){
    const securityUser:SecurityUser | undefined = this.securityUsers.find(x => x.uuid === caseFileAccess[0].subscription_user);
    return securityUser?.user.first_name + ' ' + securityUser?.user.last_name;
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

  goToExpedientInfo(caseFile:CaseFile){

    const paginatorState = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.stateService.setPaginatorState(paginatorState);

    this.router.navigate(['/expedient-info/',caseFile.uuid])

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
