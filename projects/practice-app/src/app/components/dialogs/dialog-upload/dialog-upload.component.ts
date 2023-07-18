import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, CaseFileDocument,CaseFileDocumentPayload } from 'core-models';
import { PracticeService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dialog-upload',
  templateUrl: './dialog-upload.component.html',
  styleUrls: ['./dialog-upload.component.scss']
})
export class DialogUploadComponent implements OnInit {

  caseFileDocumentForm!:FormGroup;
  caseFile!:CaseFile;
  caseFileDocument!:CaseFileDocument | null;
  selectedFile!: File;


  constructor(private formBuilder:FormBuilder,
              private practiceService:PracticeService,
              private toastr: ToastrService,
              private translateService:TranslateService,
              @Optional() public dialogRef: MatDialogRef<DialogUploadComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: {caseFile: CaseFile},
              private http: HttpClient) { }

  ngOnInit(): void {
    this.caseFile = this.data.caseFile;
    this.initForm();
  }

  initForm(){

    this.caseFileDocumentForm = this.formBuilder.group({
      document_name: ['',Validators.required]
    })

  }

  onFileAdded(value: any) {
    this.selectedFile = value.file;
  }

  submitForm(){

    const CaseFileDocumentPayload:CaseFileDocumentPayload = {
      subscription:  this.caseFile.subscription,
      case_file:     this.caseFile.uuid || '',
      document:      this.selectedFile ,
      ...this.caseFileDocumentForm.value
    }

    if(!this.caseFileDocumentForm.valid || !this.selectedFile) {
      this.toastr.error('Error','Completar campos obligatorios');
      return;
    }

    this.practiceService.createCaseFileDocument(CaseFileDocumentPayload).subscribe(data => {
      this.toastr.success('Ok', this.translateService.instant('successMessages.created_succesfully'));
      this.dialogRef.close(data);
    });

  }

}
