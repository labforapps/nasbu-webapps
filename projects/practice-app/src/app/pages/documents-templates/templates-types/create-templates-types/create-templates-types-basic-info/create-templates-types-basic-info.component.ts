import { Component, OnInit, Output,EventEmitter,Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CaseFileType, DocumentTemplateType } from 'core-models';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-create-templates-types-basic-info',
  templateUrl: './create-templates-types-basic-info.component.html',
  styleUrls: ['./create-templates-types-basic-info.component.scss']
})
export class CreateTemplatesTypesBasicInfoComponent implements OnInit {

  @Input()  documentTemplatesTypes!:DocumentTemplateType[]
  @Input()  documentTemplateType!:DocumentTemplateType
  @Input()  caseFileTypes!:CaseFileType[]
  @Output() templateTypeBasicInfo:any = new EventEmitter<any>()
  templateTypeBasicInfoForm!:FormGroup
  copied:Boolean = false
  @Input() stepper!: MatStepper;

  constructor(private formBuilder:FormBuilder,private helperService:HelpersService ) { }

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
      copied_from: [null],
      casefile_type: [null]
    })

  }

  setForm(){
    if(this.documentTemplateType){
      this.templateTypeBasicInfoForm.patchValue({
        ...this.documentTemplateType
      })

      this.copied = this.documentTemplateType.copied_from !== null || this.documentTemplateType.casefile_type !== null
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

    let requiredFields = false;

    if(documentTemplateType.name === '') requiredFields = true;
    if(this.copied && (documentTemplateType.copied_from === null && documentTemplateType.casefile_type === null)) requiredFields = true;

    if(requiredFields){
      this.helperService.showMessageRequiredFields()
      return;
    }

    this.templateTypeBasicInfo.emit(documentTemplateType)

    this.stepper.next();

  }

}
