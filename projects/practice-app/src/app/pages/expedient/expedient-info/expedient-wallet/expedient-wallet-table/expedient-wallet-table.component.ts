import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddBalanceComponent } from '../../../../../components/dialogs/dialog-add-balance/dialog-add-balance.component';
import { CaseFile, CaseFileWalletDetail } from 'core-models';
import { MatPaginator } from '@angular/material/paginator';
import { PracticeService } from 'core-services';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expedient-wallet-table',
  templateUrl: './expedient-wallet-table.component.html',
  styleUrls: ['./expedient-wallet-table.component.scss']
})
export class ExpedientWalletTableComponent implements OnInit {

  displayedColumns: string[] = ['select','type','expedient','task', 'date', 'hours','value','amount', 'action'];
  dataSourceCaseFileWalletDetail!:any;
  selection = new SelectionModel<CaseFileWalletDetail>(true, []);
  @ViewChild(MatPaginator) paginator: any;
  @Input() caseFile!:CaseFile;
  caseFileWalletDetail!:CaseFileWalletDetail[];

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private translateService:TranslateService,
              private toastr: ToastrService
    ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.displayedColumns = ['select', 'type','title','description','date','action']
    this.dataSourceCaseFileWalletDetail = new MatTableDataSource<CaseFileWalletDetail>(this.caseFileWalletDetail);
    this.dataSourceCaseFileWalletDetail.paginator = this.paginator;
  }

  getCaseFileNotes(){
   this.practiceService.getCaseFileWalletDetails(this.caseFile.subscription,this.caseFile.uuid || '').subscribe(data => {
    this.caseFileWalletDetail = data;
    this.ngAfterViewInit();
   })
  }

  openDialogAddBalance(){
    this.dialog.open(DialogAddBalanceComponent);
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
