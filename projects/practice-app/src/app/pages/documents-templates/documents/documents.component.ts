import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, Output, ViewChild,EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentGeneration } from 'core-models';
import { DialogDocumentViewerComponent } from '../../../components/dialogs/dialog-document-viewer/dialog-document-viewer.component';
import { DialogNewDocumentComponent } from '../../../components/dialogs/dialog-new-document/dialog-new-document.component';
import { HelpersService } from '../../../services/helpers.service';
import { AuthService, PracticeService } from 'core-services';
import { saveAs } from 'file-saver';
import { DialogExternalDocSignatureComponent } from '../../../components/dialogs/dialog-external-doc-signature/dialog-external-doc-signature.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  @Input() documentGenerations!:DocumentGeneration[];
  displayedColumns: string[] = ['select', 'type','description', 'taskType', 'date','signature_status', 'action'];
  dataSource = new MatTableDataSource<DocumentGeneration>(this.documentGenerations);
  selection = new SelectionModel<DocumentGeneration>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedSubscription!:any;
  @Output() onExecuteDocumentGeneration = new EventEmitter<DocumentGeneration | any>();

  constructor(public dialog: MatDialog,
             private helperService:HelpersService,
             private practiceService:PracticeService,
             private authService:AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentGenerations'] && changes['documentGenerations'].currentValue) {
      this.dataSource.data = this.documentGenerations;
    }
  }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.dataSource.data = this.documentGenerations;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  previewDocument(document:DocumentGeneration){
    document.subscription = this.selectedSubscription?.ssid.uuid
    this.dialog.open(DialogDocumentViewerComponent,{
      data: {
        url: document.document
      },
      panelClass: 'fullscreen',
    });
  }

  openDialogNewDocument(document?:DocumentGeneration){
   const dialogRef = this.dialog.open(DialogNewDocumentComponent,{
      data: {
        document
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data && data.uuid) this.onExecuteDocumentGeneration.emit({})
    })
  }

  openDialogExternalDocSignature(document:DocumentGeneration){
    this.dialog.open(DialogExternalDocSignatureComponent, {
      data: {
        document
      }
    })
  }

  deleteDocument(document:DocumentGeneration){

    document.subscription = this.selectedSubscription?.ssid.uuid

    this.helperService.showConfirmationDeleteDialog().then( (result) => {
      if(result.isConfirmed){
        this.practiceService.deleteDocumentGeneration(document).subscribe(data => {
          this.helperService.showMessageDeleted();
          this.onExecuteDocumentGeneration.emit({})
        })
      }
    })
  }

  openNewTab(documentGeneration:DocumentGeneration) {
    window.open(documentGeneration.document || '', '_blank');
  }

  searchByName(filterValue: any) {
    filterValue = filterValue.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  downloadDocument(documentGenerations:DocumentGeneration, format: string | null){
    documentGenerations.subscription = this.selectedSubscription?.ssid.uuid
    this.practiceService.downloadDocumentGenerations(documentGenerations, format).subscribe(data => {
      saveAs(data, documentGenerations.name);
    })
  }

  downloadSignatureRequestDocEvidence(documentGenerations:DocumentGeneration){
    this.practiceService.downloadSignatureRequestDocEvidence(documentGenerations).subscribe(data => {
      saveAs(data, documentGenerations.name);
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
