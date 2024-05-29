import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaseFileType, DocumentTemplateType, VariableCaseFileType, VariableDocumentTemplateType } from 'core-models';
import { PracticeService } from 'core-services';
import { DialogNewVariableComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-new-variable/dialog-new-variable.component';

@Component({
  selector: 'app-create-expedient-type-variables',
  templateUrl: './create-expedient-type-variables.component.html',
  styleUrls: ['./create-expedient-type-variables.component.scss']
})
export class CreateExpedientTypeVariablesComponent implements OnInit {

  @Input() caseFileType!:CaseFileType
  @Output() caseFileTypeVariablesOutput = new EventEmitter<VariableCaseFileType[]>()
  @Input() selectedSubscription!:any
  caseFileTypeVariables:VariableCaseFileType[] = []
  caseFileTypeVariablesAdded:VariableCaseFileType[] = []
  caseFileTypeCopied!:CaseFileType

  constructor(private matDialog:MatDialog,
              private practiceService:PracticeService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseFileType'] && changes['caseFileType'].currentValue) {
      this.caseFileType = changes['caseFileType'].currentValue
      this.setTemplateTypeVariables()
      if(!this.caseFileType.uuid && this.caseFileType.copied_from !== '') this.getCaseFileType()
    }
  }

  getCaseFileType(){
    this.practiceService.getCaseFileTypesById(this.selectedSubscription?.ssid.uuid,this.caseFileType.copied_from || '').subscribe({
      next: (data) => {
        this.caseFileTypeCopied = data
        this.caseFileTypeVariables = data.variables || []
      }
    })
  }

  setTemplateTypeVariables(){
    if(this.caseFileType){
      this.caseFileTypeVariables = this.caseFileType.variables || []
      this.caseFileTypeVariablesAdded = this.caseFileType.variables || []
    }
  }

  openDialogVariables(variable?:VariableCaseFileType){
    const dialogRef = this.matDialog.open(DialogNewVariableComponent,{
      data: {
        variable
      }
    })

    dialogRef.afterClosed().subscribe((data:any) => {
      if(data){
        const index = this.caseFileTypeVariables.findIndex(x => x.section === variable?.section && x.name === variable.name)
        const indexAdded = this.caseFileTypeVariablesAdded.findIndex(x => x.section === variable?.section && x.name === variable.name)

        const dataDialog = data

        delete data.openAnother

        if(index > -1){
          this.caseFileTypeVariables[index] = data
          this.caseFileTypeVariablesAdded[indexAdded] = data
        }
        else{
          this.caseFileTypeVariablesAdded.push(data)
          this.caseFileTypeVariables.push(data)
        }

        if(dataDialog.openAnother) this.openDialogVariables({...dataDialog,name:''})
      }
    })

  }

  isVariableAdded(variable:VariableCaseFileType){
    return this.caseFileTypeVariablesAdded.filter(x => x.section === variable.section && x.name === variable.name).length > 0 ? true : false
  }

  addVariable(variable:VariableCaseFileType){
    this.caseFileTypeVariablesAdded.push(variable)
  }

  deleteVariable(variable:VariableCaseFileType){

    const index = this.caseFileTypeVariables.findIndex(x => x.section === variable?.section && x.name === variable.name)
    if(index > -1 ) this.caseFileTypeVariables.splice(index,1)

    this.deleteVariableAdded(variable)
  }

  deleteVariableAdded(variable:VariableCaseFileType){

    const index = this.caseFileTypeVariablesAdded.findIndex(x => x.section === variable?.section && x.name === variable.name)
    if(index > -1 ) this.caseFileTypeVariablesAdded.splice(index,1)
  }

  submitForm(){
    this.caseFileTypeVariablesOutput.emit(this.caseFileTypeVariablesAdded)
  }

}
