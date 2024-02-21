import { Component, OnInit, Output,EventEmitter,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTemplate } from 'core-models';
import { PracticeService } from 'core-services';

@Component({
  selector: 'app-create-templates-types-basic-info',
  templateUrl: './create-templates-types-basic-info.component.html',
  styleUrls: ['./create-templates-types-basic-info.component.scss']
})
export class CreateTemplatesTypesBasicInfoComponent implements OnInit {

  @Input() documentTemplates!:DocumentTemplate[]
  @Output() templateTypeBasicInfo:any = new EventEmitter<any>()
  templateTypeBasicInfoForm!:FormGroup

  constructor(private formBuilder:FormBuilder ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){

    this.templateTypeBasicInfoForm = this.formBuilder.group({
      code: ['',Validators.required],
      name: ['',Validators.required],
      require_signature: [true,Validators.required]
    })

  }

  submitForm(){
    this.templateTypeBasicInfo.emit(this.templateTypeBasicInfoForm.value)
  }

}
