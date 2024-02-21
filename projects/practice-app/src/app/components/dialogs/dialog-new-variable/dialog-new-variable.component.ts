import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogNewSectionComponent } from '../dialog-new-section/dialog-new-section.component';
import { DocumentTemplatesService } from '../../../services/document-templates.service';

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
              private documentTemplateService:DocumentTemplatesService) { }

  ngOnInit(): void {
    this.sections = this.documentTemplateService.sections
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
