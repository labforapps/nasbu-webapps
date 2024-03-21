import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentTemplate, DocumentTemplateType } from 'core-models';
import { PracticeService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import { DialogDocumentViewerComponent } from '../../../components/dialogs/dialog-document-viewer/dialog-document-viewer.component';
import { DialogNewTemplateComponent } from '../../../components/dialogs/dialog-new-template/dialog-new-template.component';
import { saveAs } from 'file-saver';
import { DialogExternalDocSignatureComponent } from '../../../components/dialogs/dialog-external-doc-signature/dialog-external-doc-signature.component';

@Component({
  selector: 'app-templates-types',
  templateUrl: './templates-types.component.html',
  styleUrls: ['./templates-types.component.scss']
})
export class TemplatesTypesComponent implements OnInit {

  @Input() documentTemplatesTypes!:DocumentTemplateType[];
  displayedColumns: string[] = ['select', 'type','description', 'taskType', 'date', 'action'];
  dataSource = new MatTableDataSource<DocumentTemplateType>(this.documentTemplatesTypes);
  selection = new SelectionModel<DocumentTemplateType>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() onExecuteDocumentTemplate = new EventEmitter<DocumentTemplate | any>();

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private helperService:HelpersService ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentTemplates'] && changes['documentTemplates'].currentValue) {
      this.dataSource.data = this.documentTemplatesTypes;
    }
  }

  ngOnInit(): void {
    this.dataSource.data = this.documentTemplatesTypes;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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

  deleteTemplateType(documentTemplateType:DocumentTemplateType){
    this.helperService.showConfirmationDeleteDialog().then( (result) => {
      if(result.isConfirmed){
        this.practiceService.deleteDocumentTemplateType(documentTemplateType.subscription,documentTemplateType.uuid || '').subscribe(data => {
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

  openDialogExternalDocSignature(){
    this.dialog.open(DialogExternalDocSignatureComponent)
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

