import { Component, OnInit, Output,EventEmitter,Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTemplate, DocumentTemplateType } from 'core-models';

@Component({
  selector: 'app-create-templates-types-basic-info',
  templateUrl: './create-templates-types-basic-info.component.html',
  styleUrls: ['./create-templates-types-basic-info.component.scss']
})
export class CreateTemplatesTypesBasicInfoComponent implements OnInit {

  @Input() documentTemplates!:DocumentTemplate[]
  @Input() documentTemplateType!:DocumentTemplateType
  @Output() templateTypeBasicInfo:any = new EventEmitter<any>()
  templateTypeBasicInfoForm!:FormGroup

  constructor(private formBuilder:FormBuilder ) { }

  ngOnInit(): void {
    this.initForm()
    this.setForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentTemplateType'] && changes['documentTemplateType'].currentValue) {
      this.setForm()
    }

    if (changes['documentTemplates'] && changes['documentTemplates'].currentValue) {
      this.documentTemplates = changes['documentTemplates'].currentValue
    }
  }

  initForm(){

    this.templateTypeBasicInfoForm = this.formBuilder.group({
      code: ['',Validators.required],
      name: ['',Validators.required],
      require_signature: [true,Validators.required]
    })

  }

  setForm(){
    if(this.documentTemplateType){
      this.templateTypeBasicInfoForm.patchValue({
        ...this.documentTemplateType
      })
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
