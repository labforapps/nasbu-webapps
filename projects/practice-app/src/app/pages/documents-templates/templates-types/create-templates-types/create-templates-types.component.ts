import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentTemplateType, VariableDocumentTemplateType } from 'core-models';
import { AuthService, PracticeService } from 'projects/core-services/src/public-api';
import { DialogNewVariableComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-new-variable/dialog-new-variable.component';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-create-templates-types',
  templateUrl: './create-templates-types.component.html',
  styleUrls: ['./create-templates-types.component.scss']
})
export class CreateTemplatesTypesComponent implements OnInit {

  public documentTemplatesTypes!:DocumentTemplateType
  public variablesTemplatesTypes!:VariableDocumentTemplateType[]
  private selectedSubscription!:any

  constructor(public  dialog: MatDialog,
              private practiceService:PracticeService,
              private authService:AuthService,
              private helperService:HelpersService,
              private router:Router) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
  }

  createDocumentTemplateTypes(){

    const documentTemplaTypePayload:DocumentTemplateType = {
      subscription: this.selectedSubscription?.ssid.uuid,
      code: this.documentTemplatesTypes.code,
      name: this.documentTemplatesTypes.name,
      require_signature: this.documentTemplatesTypes.require_signature,
      variables: this.variablesTemplatesTypes
    }

    this.practiceService.createDocumentTemplateTypes(documentTemplaTypePayload).subscribe({
      next: (data) => {
        this.helperService.showMessageCreated()
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
