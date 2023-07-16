import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CaseFile, CaseFileDocument,CaseFileDocumentPayload } from 'core-models';
import { PracticeService } from 'core-services';
import { ToastrService } from 'ngx-toastr';
import { FilePickerAdapter } from 'ngx-awesome-uploader';

import { DemoFilePickerAdapter } from './demo-file-picker.adapter';
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
  public adapter = new DemoFilePickerAdapter(this.http);


  constructor(private formBuilder:FormBuilder,
              private practiceService:PracticeService,
              private toastr: ToastrService,
              private translateService:TranslateService,
              @Optional() public dialogRef: MatDialogRef<DialogUploadComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: CaseFile,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){

    this.caseFileDocumentForm = this.formBuilder.group({
      filename: ['',Validators.required]
    })

  }

  public uploadSuccess(event:any): void {
    console.log(event);
  }

  submitForm(){

    const CaseFileDocumentPayload:CaseFileDocumentPayload = {
      subscription:  '',
      case_file:     '',
     // document:      ,
      document_name: ''
    }

    this.practiceService.createCaseFileDocument(CaseFileDocumentPayload).subscribe(data => {
      console.log(data);
    })


  }

}
