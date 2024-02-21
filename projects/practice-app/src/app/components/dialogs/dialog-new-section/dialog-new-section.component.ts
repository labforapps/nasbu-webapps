import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentTemplatesService } from '../../../services/document-templates.service';

@Component({
  selector: 'app-dialog-new-section',
  templateUrl: './dialog-new-section.component.html',
  styleUrls: ['./dialog-new-section.component.scss']
})
export class DialogNewSectionComponent implements OnInit {

  sectionName!:string;

  constructor(private dialogRef: MatDialogRef<DialogNewSectionComponent>,
              private documentTemplateService:DocumentTemplatesService) { }

  ngOnInit(): void {
  }

  submitForm(){
    this.documentTemplateService.sections.push(this.sectionName)
    this.dialogRef.close()
  }

}
