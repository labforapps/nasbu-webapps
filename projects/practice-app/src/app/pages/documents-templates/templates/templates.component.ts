import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentTemplate } from 'core-models';
import { DialogNewDocumentComponent } from '../../../components/dialogs/dialog-new-document/dialog-new-document.component';
import { PracticeService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { DialogDocumentViewerComponent } from '../../../components/dialogs/dialog-document-viewer/dialog-document-viewer.component';
import { DialogNewTemplateComponent } from '../../../components/dialogs/dialog-new-template/dialog-new-template.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  @Input() documentTemplates!:DocumentTemplate[];
  displayedColumns: string[] = ['select', 'type','description', 'taskType', 'date', 'action'];
  dataSource = new MatTableDataSource<DocumentTemplate>(this.documentTemplates);
  selection = new SelectionModel<DocumentTemplate>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() onExecuteDocumentTemplate = new EventEmitter<DocumentTemplate | any>();

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private helperService:HelpersService ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentTemplates'] && changes['documentTemplates'].currentValue) {
      this.dataSource.data = this.documentTemplates;
    }
  }

  ngOnInit(): void {
    this.dataSource.data = this.documentTemplates;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDialogNewDocument(template:DocumentTemplate){
    this.dialog.open(DialogNewDocumentComponent,{
      data: {
        template
      }
    })
  }

  openDialogNewTemplate(template:DocumentTemplate){
    const dialogRef = this.dialog.open(DialogNewTemplateComponent,{
      data: {
        template
      }
    })

    dialogRef.afterClosed().subscribe(data => {
      if(data.uuid){
        this.onExecuteDocumentTemplate.emit({})
      }
    })
  }

  deleteTemplate(documentTemplate:DocumentTemplate){
    this.helperService.showConfirmationDeleteDialog().then( (result) => {
      if(result.isConfirmed){
        this.practiceService.deleteDocumentTemplate(documentTemplate).subscribe(data => {
          this.helperService.showMessageDeleted();
          this.onExecuteDocumentTemplate.emit({})
        });
      }
    })
  }

  previewDocument(document:DocumentTemplate){
    this.dialog.open(DialogDocumentViewerComponent,{
      data: {
        url: document.document
      },
      panelClass: 'fullscreen',
    });
  }

  searchByName(filterValue: any) {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  downloadDocumentTemplate(documentTemplate:DocumentTemplate){
    this.practiceService.downloadDocumentTemplate(documentTemplate).subscribe(data => {
      saveAs(data, documentTemplate.name);
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
