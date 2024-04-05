import { Component, OnInit, Output,EventEmitter,Input, SimpleChanges, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentTemplate, DocumentTemplateType,CaseFileType } from 'core-models';
import { CreateExpedientTypeComponent } from '../create-expedient-type.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-expedient-type-basic-info',
  templateUrl: './create-expedient-type-basic-info.component.html',
  styleUrls: ['./create-expedient-type-basic-info.component.scss']
})
export class CreateExpedientTypeBasicInfoComponent implements OnInit {

  @Input() caseFileTypes!:CaseFileType[]
  @Input() caseFileType!:CaseFileType
  @Output() caseFileTypeBasicInfo:any = new EventEmitter<any>()
  caseFileTypeBasicInfoForm!:FormGroup
  copied:Boolean = false

  constructor(private formBuilder:FormBuilder,
              @Optional() @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              @Optional() private dialogRef: MatDialogRef<CreateExpedientTypeComponent>,
              private router:Router ) { }

  ngOnInit(): void {
    this.initForm()
    this.setForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseFileType'] && changes['caseFileType'].currentValue) {
      this.setForm()
    }

    if (changes['caseFileTypes'] && changes['caseFileTypes'].currentValue) {
      this.caseFileTypes = changes['caseFileTypes'].currentValue
    }
  }

  initForm(){

    this.caseFileTypeBasicInfoForm = this.formBuilder.group({
      code: ['code',Validators.required],
      name: ['',Validators.required],
      require_signature: [true,Validators.required],
      copied_from: ['']
    })

  }

  setForm(){
    if(this.caseFileType){
      this.caseFileTypeBasicInfoForm.patchValue({
        ...this.caseFileType
      })

      this.copied = this.caseFileType.copied_from !== null
    }
  }

  submitForm(){

    const caseFileType:CaseFileType = {
      ...this.caseFileTypeBasicInfoForm.value
    }

    if(this.caseFileType){
      caseFileType.uuid = this.caseFileType.uuid
      caseFileType.variables = this.caseFileType.variables
    }

    this.caseFileTypeBasicInfo.emit(caseFileType)
  }

  cancel(){
    if(this.dataDialog){
      this.dialogRef.close()
    }
    else{
      this.router.navigate(["/expedient"])
    }
  }

}
