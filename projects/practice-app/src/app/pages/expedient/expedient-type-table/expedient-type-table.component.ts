import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CaseFileType,DocumentTemplateType } from 'core-models';
import { AuthService, PracticeService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-expedient-type-table',
  templateUrl: './expedient-type-table.component.html',
  styleUrls: ['./expedient-type-table.component.scss']
})
export class ExpedientTypeTableComponent implements OnInit {

  expedientTypes!:CaseFileType[]
  displayedColumns: string[] = ['select', 'type','description', 'taskType', 'date', 'action'];
  dataSource = new MatTableDataSource<CaseFileType>(this.expedientTypes);
  selection = new SelectionModel<CaseFileType>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedSubscription!:any;

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private helperService:HelpersService,
              private authService:AuthService ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage()
    this.getCaseFilesType()
  }

  getCaseFilesType(){
    this.practiceService.getCaseFileTypes(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.expedientTypes = data;
      this.dataSource.data = this.expedientTypes;
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  deleteTemplateType(documentTemplateType:DocumentTemplateType){
    this.helperService.showConfirmationDeleteDialog().then( (result) => {
      if(result.isConfirmed){
        this.practiceService.deleteCaseFileType(documentTemplateType.subscription,documentTemplateType.uuid || '').subscribe(data => {
          this.helperService.showMessageDeleted();
          this.getCaseFilesType()
        });
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
