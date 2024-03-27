import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentTemplateType, VariableDocumentTemplateType } from 'core-models';
import { AuthService, PracticeService } from 'projects/core-services/src/public-api';
import { DialogNewVariableComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-new-variable/dialog-new-variable.component';
import { DocumentTemplatesService } from 'projects/practice-app/src/app/services/document-templates.service';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-create-templates-types',
  templateUrl: './create-templates-types.component.html',
  styleUrls: ['./create-templates-types.component.scss']
})
export class CreateTemplatesTypesComponent implements OnInit {

  public documentTemplateType!:DocumentTemplateType
  public variablesTemplatesTypes!:VariableDocumentTemplateType[]
  public selectedSubscription!:any
  private documentTemplateTypeId!:string
  public documentTemplatesTypes!:DocumentTemplateType[]

  constructor(public  dialog: MatDialog,
              private practiceService:PracticeService,
              private authService:AuthService,
              private helperService:HelpersService,
              private router:Router,
              private activatedRoute:ActivatedRoute,
              private documentTemplateService:DocumentTemplatesService) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.getDocumentTemplates()

    this.activatedRoute.params.subscribe(params => {
     this.documentTemplateTypeId = params['id']
     if(this.documentTemplateTypeId) this.getDocumentTemplateTypeById()
    });

  }

  getDocumentTemplates(){
    this.practiceService.getDocumentTemplateTypes(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.documentTemplatesTypes = data
    })
  }

  getDocumentTemplateTypeById(){
    this.practiceService.getDocumentTemplateTypesById(this.selectedSubscription?.ssid.uuid,this.documentTemplateTypeId).subscribe(data => {
      this.documentTemplateType = data
      this.setDocumentTemplateTypeSections()
    })
  }

  setDocumentTemplateTypeSections(){

    if(this.documentTemplateType){
      const sections = new Set(this.documentTemplateType.variables?.map(variable => variable.section))
      sections?.forEach(section => this.documentTemplateService.sections.push(section))
    }
  }

  createDocumentTemplateTypes(){

    const documentTemplaTypePayload:DocumentTemplateType = {
      subscription: this.selectedSubscription?.ssid.uuid,
      code: this.documentTemplateType.code,
      name: this.documentTemplateType.name,
      require_signature: this.documentTemplateType.require_signature,
      copied_from: this.documentTemplateType.copied_from,
      variables: this.variablesTemplatesTypes,
    }

    if(this.documentTemplateTypeId) documentTemplaTypePayload.uuid = this.documentTemplateTypeId

    this.practiceService.saveDocumentTemplateType(documentTemplaTypePayload).subscribe({
      next: (data) => {
       if(this.documentTemplateTypeId){
        this.helperService.showMessageUpdated()
       }
       else{
        this.helperService.showMessageCreated()
       }
        this.router.navigate(['/templates'])
      },
      error: (error) => {
        this.helperService.showCustomMessage('Error','Ha ocurrido un error','Este tipo de plantilla no pudo ser creada')
      }
    })

  }

  openDialogNewVariable() {
    this.dialog.open(DialogNewVariableComponent)
  }

}
