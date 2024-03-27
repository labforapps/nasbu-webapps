import { Component, OnInit, Output,EventEmitter,Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTemplate, DocumentTemplateType } from 'core-models';

@Component({
  selector: 'app-create-templates-types-basic-info',
  templateUrl: './create-templates-types-basic-info.component.html',
  styleUrls: ['./create-templates-types-basic-info.component.scss']
})
export class CreateTemplatesTypesBasicInfoComponent implements OnInit {

  @Input() documentTemplatesTypes!:DocumentTemplateType[]
  @Input() documentTemplateType!:DocumentTemplateType
  @Output() templateTypeBasicInfo:any = new EventEmitter<any>()
  templateTypeBasicInfoForm!:FormGroup
  copied:Boolean = false

  constructor(private formBuilder:FormBuilder ) { }

  ngOnInit(): void {
    this.initForm()
    this.setForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentTemplateType'] && changes['documentTemplateType'].currentValue) {
      this.setForm()
    }

    if (changes['documentTemplatesTypes'] && changes['documentTemplatesTypes'].currentValue) {
      this.documentTemplatesTypes = changes['documentTemplatesTypes'].currentValue
    }
  }

  initForm(){

    this.templateTypeBasicInfoForm = this.formBuilder.group({
      code: ['code',Validators.required],
      name: ['',Validators.required],
      require_signature: [true,Validators.required],
      copied_from: ['']
    })

  }

  setForm(){
    if(this.documentTemplateType){
      this.templateTypeBasicInfoForm.patchValue({
        ...this.documentTemplateType
      })

      this.copied = this.documentTemplateType.copied_from !== null
    }
  }

  submitForm(){

    const documentTemplateType:DocumentTemplateType = {
      ...this.templateTypeBasicInfoForm.value
    }

    if(this.documentTemplateType){
      documentTemplateType.uuid = this.documentTemplateType.uuid
      documentTemplateType.variables = this.documentTemplateType.variables
    }

    this.templateTypeBasicInfo.emit(documentTemplateType)
  }

}
