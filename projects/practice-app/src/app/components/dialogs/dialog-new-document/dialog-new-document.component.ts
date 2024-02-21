import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseFile, Customer, SecurityUser, DocumentTemplate, DocumentGenerationPayload, DocumentGeneration, DocumentTemplateType, VariableDocumentTemplateType } from 'core-models';
import { AuthService, CustomersService, PracticeService, SecurityService } from 'core-services';
import { HelpersService } from '../../../services/helpers.service';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-dialog-new-document',
  templateUrl: './dialog-new-document.component.html',
  styleUrls: ['./dialog-new-document.component.scss']
})
export class DialogNewDocumentComponent implements OnInit {

  documentForm!:FormGroup;
  customers!:Customer[];
  caseFiles!:CaseFile[];
  securityUsers!:SecurityUser[];
  documentTemplates!:DocumentTemplate[];
  selectedSubscription!:any;
  documentGeneration!:DocumentGeneration;
  documentTemplateType!:DocumentTemplateType
  variablesSections:string[] = []
  variablesForm!:FormGroup;
  activeTabIndex = 0;
  totalTabs = 1

  constructor(private formBuilder:FormBuilder,
              private customerService:CustomersService,
              private practiceService:PracticeService,
              private securityService:SecurityService,
              private helperService:HelpersService,
              private authService:AuthService,
              public dialogRef: MatDialogRef<DialogNewDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: {document:DocumentGeneration,template:DocumentTemplate}
             ) { }

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
    this.initForm();
    this.getCustomers();
    this.getCaseFiles();
    this.getSecurityUsers();
    this.getDocumentTemplates();
    this.setForm();
  }

  initForm(){

    this.documentForm = this.formBuilder.group({
      name: ['',Validators.required],
      expiration_date: ['',Validators.required],
      document_template: ['',Validators.required],
      case_file: [null],
      customer: ['',Validators.required],
      representative: ['',Validators.required],
    })

    this.documentForm.patchValue({
      expiration_date: new Date()
    })

    this.variablesForm = this.formBuilder.group({})

  }

  setForm(){
    if(this.dataDialog && this.dataDialog.document){
      this.documentForm.patchValue({
        ...this.dataDialog.document
      })

      this.documentGeneration = this.dataDialog.document;
    }

    if(this.dataDialog && this.dataDialog.template){
      this.documentForm.patchValue({
        document_template: this.dataDialog.template.uuid
      })
    }
  }

  getCustomers(){
    this.customerService.getCustomers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.customers = data;
    })
  }

  getCaseFiles(){
    this.practiceService.getCaseFiles(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.caseFiles = data;
    })
  }

  getSecurityUsers(){
    this.securityService.getSecurityUsers(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.securityUsers = data;
    })
  }

  getDocumentTemplates(){
    this.practiceService.getDocumentTemplates(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.documentTemplates = data;
    })
  }

  getDocumentTemplateType(selection:MatSelectChange){

    const documentTemplate:DocumentTemplate | null = this.documentTemplates.find(x => x.uuid === selection.value) || null

    if(documentTemplate){
      this.practiceService.getDocumentTemplateTypesById(this.selectedSubscription?.ssid.uuid,documentTemplate.template_type).subscribe(data => {
        data.variables?.forEach(x => this.variablesForm.addControl(`${x.value_path}`,this.formBuilder.control('')))
        this.documentTemplateType = data;
        this.variablesSections = [...new Set( data.variables ? data.variables.map(item => item.section) : '')]
        this.totalTabs = 1 + this.variablesSections.length
      })
    }
  }

  goToNextTab(){
    this.activeTabIndex += 1
  }

  goToPreviousTab(){
    this.activeTabIndex -= 1
  }

  onChangeCaseFile(selection:MatSelectChange){
    const caseFile:CaseFile | undefined = this.caseFiles.find(x => x.uuid === selection.value);

    this.documentForm.patchValue({
      customer: caseFile?.customer.uuid,
      representative: caseFile?.assigned_to.uuid
    })
  }

  slugify(str:string) {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
  }

  submitForm(){

    if(!this.documentForm.valid){
      this.helperService.showMessageRequiredFields();
      return;
    }

    const customVariableData:any = {};

    this.variablesSections.forEach((x:string) => {

      const variables = this.documentTemplateType.variables?.filter((y:VariableDocumentTemplateType) => y.section === x);

      customVariableData[this.slugify(x)] = variables?.map(variable => {

        const obj:{[s: string] : string} = {}

        obj[`${variable.name}`] =  this.variablesForm.value[variable.value_path]

        return obj
      }).reduce((a,b)  => { return { ...a,...b } },{} )
    })

    const payload:DocumentGenerationPayload = {
      ...this.documentForm.value,
      subscription: this.selectedSubscription?.ssid.uuid,
      expiration_date: moment(this.documentForm.value.expiration_date).format('YYYY-MM-DD'),
      custom_variables_data: JSON.stringify(customVariableData)
    }

    if(this.documentGeneration) payload.uuid = this.documentGeneration.uuid;

    this.practiceService.saveDocumentGeneration(payload).subscribe(data => {
      if(payload.uuid){
        this.helperService.showMessageUpdated();
      }
      else{
        this.helperService.showMessageCreated();
      }

      this.dialogRef.close(data);
    })

  }

}
