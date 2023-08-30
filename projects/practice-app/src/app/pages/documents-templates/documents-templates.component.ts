import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewDocumentComponent } from '../../components/dialogs/dialog-new-document/dialog-new-document.component';
import { DialogNewTemplateComponent } from '../../components/dialogs/dialog-new-template/dialog-new-template.component';
import { AuthService, PracticeService } from 'core-services';
import { DocumentGeneration, DocumentTemplate } from 'core-models';

@Component({
  selector: 'app-documents-templates',
  templateUrl: './documents-templates.component.html',
  styleUrls: ['./documents-templates.component.scss']
})
export class DocumentsTemplatesComponent implements OnInit {

  selectedSubscription!:any;
  documentTemplates!:DocumentTemplate[];
  documentGenerations!:DocumentGeneration[];

  constructor(public dialog: MatDialog,
              private practiceService:PracticeService,
              private authService:AuthService) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.getDocumentTemplates();
    this.getDocumentGenerations();
  }

  getDocumentTemplates(){
    this.practiceService.getDocumentTemplates(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.documentTemplates = data;
    })
  }

  getDocumentGenerations(){
    this.practiceService.getDocumentGenerations(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.documentGenerations = data;
    })
  }

  openDialogNewDocument(){
    const dialogRef = this.dialog.open(DialogNewDocumentComponent);

    dialogRef.afterClosed().subscribe(data => {
      if(data.uuid) this.getDocumentGenerations();
    })
  }

  openDialogNewTemplate(){
    const dialogRef = this.dialog.open(DialogNewTemplateComponent);

    dialogRef.afterClosed().subscribe(data => {
      if(data.uuid) this.getDocumentTemplates();
    })
  }

}
