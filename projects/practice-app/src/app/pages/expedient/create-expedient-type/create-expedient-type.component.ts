import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseFileType, VariableCaseFileType } from 'core-models';
import { AuthService, PracticeService } from 'projects/core-services/src/public-api';
import { DialogNewVariableComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-new-variable/dialog-new-variable.component';
import { HelpersService } from 'projects/practice-app/src/app/services/helpers.service';

@Component({
  selector: 'app-create-expedient-type',
  templateUrl: './create-expedient-type.component.html',
  styleUrls: ['./create-expedient-type.component.scss']
})
export class CreateExpedientTypeComponent implements OnInit {

  public caseFileType!:CaseFileType
  public variablesCaseFilesTypes!:VariableCaseFileType[]
  public selectedSubscription!:any
  private caseFileTypeId!:string
  public caseFileTypes!:CaseFileType[]

  constructor(public  dialog: MatDialog,
              private practiceService:PracticeService,
              private authService:AuthService,
              private helperService:HelpersService,
              private router:Router,
              private activatedRoute:ActivatedRoute,
              @Optional() @Inject(MAT_DIALOG_DATA) public dataDialog: any,
              @Optional() private dialogRef: MatDialogRef<CreateExpedientTypeComponent>) {}

  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.getCaseFileTypes()

    this.activatedRoute.params.subscribe(params => {
     this.caseFileTypeId = params['id']
     if(this.caseFileTypeId) this.getCaseFileTypeById()
    });

  }

  getCaseFileTypes(){
    this.practiceService.getCaseFileTypes(this.selectedSubscription?.ssid.uuid).subscribe(data => {
      this.caseFileTypes = data
    })
  }

  getCaseFileTypeById(){
    this.practiceService.getCaseFileTypesById(this.selectedSubscription?.ssid.uuid,this.caseFileTypeId).subscribe(data => {
      this.caseFileType = data
      this.setCaseFileTypeSections()
    })
  }

  setCaseFileTypeSections(){

    if(this.caseFileType){
      const sections = new Set(this.caseFileType.variables?.map(variable => variable.section))
     //sections?.forEach(section => this.caseFileService.sections.push(section))
    }
  }

  createCaseFileTypes(){

    const caseFileTypePayload:CaseFileType = {
      subscription: this.selectedSubscription?.ssid.uuid,
      code: this.caseFileType.code,
      name: this.caseFileType.name,
      copied_from: this.caseFileType.copied_from,
      variables: this.variablesCaseFilesTypes,
    }

    if(this.caseFileTypeId) caseFileTypePayload.uuid = this.caseFileTypeId

    this.practiceService.saveCaseFileType(caseFileTypePayload).subscribe({
      next: (data) => {
       if(this.caseFileTypeId){
        this.helperService.showMessageUpdated()
       }
       else{
        this.helperService.showMessageCreated()
       }

       if(this.dataDialog) {
        this.dialogRef.close(data);
      }
      else{
        this.router.navigate(['/expedient'])
      }
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
