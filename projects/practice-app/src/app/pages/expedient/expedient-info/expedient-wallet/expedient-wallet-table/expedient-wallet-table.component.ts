import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddBalanceComponent } from '../../../../../components/dialogs/dialog-add-balance/dialog-add-balance.component';
import { CaseFile, CaseFileStatus, CaseFileWalletDetail,CaseFileWalletDetailType } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { PracticeService } from 'core-services';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DialogPaymentRegisterComponent } from '../../../../../components/dialogs/dialog-payment-register/dialog-payment-register.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expedient-wallet-table',
  templateUrl: './expedient-wallet-table.component.html',
  styleUrls: ['./expedient-wallet-table.component.scss']
})
export class ExpedientWalletTableComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSourceCaseFileWalletDetail!:any;
  selection = new SelectionModel<CaseFileWalletDetail>(true, []);
  @ViewChild(MatPaginator) paginator: any;
  @Input() caseFile!:CaseFile;
  @Input() caseFileWalletDetail!:CaseFileWalletDetail[];
  @Input() inputCaseFileWalletDetailType!: CaseFileWalletDetailType.CREDIT |  CaseFileWalletDetailType.DEBIT | CaseFileWalletDetailType.ALL;
  caseFileWalletDetailType = CaseFileWalletDetailType;
  caseFileStatus = CaseFileStatus;
  onChangeValue = 0;
  @Output() onDeleteWalletDetail = new EventEmitter<string>();
  @Output() onUpdateWalletDetail = new EventEmitter<CaseFileWalletDetail>();


  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private translateService:TranslateService,
              private toastr: ToastrService
    ) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['caseFileWalletDetail'] && changes['caseFileWalletDetail'].currentValue){
      if(this.dataSourceCaseFileWalletDetail){
        this.dataSourceCaseFileWalletDetail.data = changes['caseFileWalletDetail'].currentValue;
      }
    }
  }

  ngAfterViewInit(): void {
    this.displayedColumns = ['select','type','task', 'date','value', 'action'];
    this.dataSourceCaseFileWalletDetail = new MatTableDataSource<CaseFileWalletDetail>(this.caseFileWalletDetail);
    this.dataSourceCaseFileWalletDetail.paginator = this.paginator;
  }

  openDialogAddBalance(caseFileWalletDetail?:CaseFileWalletDetail){
    const dialogRef = this.dialog.open(DialogAddBalanceComponent, {
      data: {
        caseFile: this.caseFile,
        caseFileWalletDetail: caseFileWalletDetail
      }
    });

    dialogRef.afterClosed().subscribe((result:CaseFileWalletDetail) => {

      this.onUpdateWalletDetail.emit(result);

      // if(result.uuid){
      //   const caseFileFiltered = this.caseFileWalletDetail.filter(x => x.uuid === result.uuid);

      //   if(caseFileFiltered.length > 0){
      //     this.caseFileWalletDetail = this.caseFileWalletDetail.filter(x => x.uuid !== result.uuid);
      //     this.caseFileWalletDetail.push(result);
      //     this.ngAfterViewInit();
      //   }
      //   else{
      //     this.caseFileWalletDetail.push(result);
      //     this.ngAfterViewInit();
      //   }
      // }
    });

  }

  returnAmountCaseFileWalletDetails(){
    return this.caseFileWalletDetail.reduce((sum, caseFileWalletDetail) => {
      return sum + Number(caseFileWalletDetail.amt);
    }, 0);
  }

  returnDateFormatted(dateCaseFile: string) {
    const date = moment(dateCaseFile);
    const formattedDate = date.locale('es').format('D MMM. YYYY');

    return formattedDate;
  }

  openDialogPaymentRegister(){
    this.dialog.open(DialogPaymentRegisterComponent);
  }

  deleteCaseFileWalletDetail(caseFile:CaseFile){
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
          .deleteCaseFileWalletDetail(caseFile.subscription, caseFile.uuid || '')
          .subscribe(
            (data) => {

              const arrayFiltered = this.caseFileWalletDetail.filter(x => x.uuid !== caseFile.uuid);
              this.caseFileWalletDetail = arrayFiltered;
              this.dataSourceCaseFileWalletDetail.data = this.caseFileWalletDetail;

              this.toastr.success(
                'Ok',
                this.translateService.instant(
                  'successMessages.deleted_successfully'
                )
              );

              this.onDeleteWalletDetail.emit(caseFile.uuid);

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
    const numRows = this.dataSourceCaseFileWalletDetail.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceCaseFileWalletDetail.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


}
