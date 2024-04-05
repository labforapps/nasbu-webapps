import { Component, OnInit, Output,EventEmitter,Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTemplate, DocumentTemplateType,CaseFileType } from 'core-models';

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

  constructor(private formBuilder:FormBuilder ) { }

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

}
