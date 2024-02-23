import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogNewSectionComponent } from '../dialog-new-section/dialog-new-section.component';
import { DocumentTemplatesService } from '../../../services/document-templates.service';
import { CaseFile, Customer, SecurityUser, VariableDocumentTemplateType } from 'core-models';

@Component({
  selector: 'app-dialog-new-variable',
  templateUrl: './dialog-new-variable.component.html',
  styleUrls: ['./dialog-new-variable.component.scss']
})
export class DialogNewVariableComponent implements OnInit {

  section!:string
  name!:string
  sections:string[] = []

  constructor(private dialogRef: MatDialogRef<DialogNewVariableComponent>,
              private matDialog:MatDialog,
              private documentTemplateService:DocumentTemplatesService,
              @Inject(MAT_DIALOG_DATA) public dataDialog: {variable:VariableDocumentTemplateType}
              ) { }

  ngOnInit(): void {
    this.sections = this.documentTemplateService.sections

    if(this.dataDialog && this.dataDialog.variable){
      this.section = this.dataDialog.variable.section
      this.name = this.dataDialog.variable.name
    }
  }

  openDialogNewSection(){

    const dialogRef = this.matDialog.open(DialogNewSectionComponent)

    dialogRef.afterClosed().subscribe(data => {
      if(data) this.sections.push(data)
    })

  }

  submitForm(){

    this.dialogRef.close({
      section: this.section,
      name: this.name
    })

  }

}
