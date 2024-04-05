import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaseFileType, DocumentTemplateType, VariableDocumentTemplateType } from 'core-models';
import { PracticeService } from 'core-services';
import { DialogNewVariableComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-new-variable/dialog-new-variable.component';

@Component({
  selector: 'app-create-templates-types-variables',
  templateUrl: './create-templates-types-variables.component.html',
  styleUrls: ['./create-templates-types-variables.component.scss']
})
export class CreateTemplatesTypesVariablesComponent implements OnInit {

  @Input()  documentTemplateType!:DocumentTemplateType
  @Output() templateTypesVariablesOutput = new EventEmitter<VariableDocumentTemplateType[]>()
  @Input()  selectedSubscription!:any
  templateTypesVariables:VariableDocumentTemplateType[] = []
  templateTypesVariablesAdded:VariableDocumentTemplateType[] = []
  documentTemplateTypeCopied!:DocumentTemplateType
  caseFileType!:CaseFileType

  constructor(private matDialog:MatDialog,
              private practiceService:PracticeService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentTemplateType'] && changes['documentTemplateType'].currentValue) {
      this.documentTemplateType = changes['documentTemplateType'].currentValue
      this.setTemplateTypeVariables()
      if(!this.documentTemplateType.uuid && this.documentTemplateType.copied_from !== '') this.getDocumentTemplateType()
      if(!this.documentTemplateType.uuid && this.documentTemplateType.casefile_type !== '') this.getCaseFileTypeById()
    }
  }

  getDocumentTemplateType(){
    this.practiceService.getDocumentTemplateTypesById(this.selectedSubscription?.ssid.uuid,this.documentTemplateType.copied_from || '').subscribe({
      next: (data) => {
        this.documentTemplateTypeCopied = data
        data.variables?.map( variable => this.templateTypesVariables.push(variable))
      }
    })
  }

  getCaseFileTypeById(){
    this.practiceService.getCaseFileTypesById(this.selectedSubscription?.ssid.uuid,this.documentTemplateType.casefile_type || '').subscribe(data => {
      this.caseFileType = data
      data.variables.map(variable => this.templateTypesVariablesAdded.push(variable))
    })
  }

  setTemplateTypeVariables(){
    if(this.documentTemplateType){
      this.templateTypesVariables = this.documentTemplateType.variables || []
      this.templateTypesVariablesAdded = this.documentTemplateType.variables || []
    }
  }

  openDialogVariables(variable?:VariableDocumentTemplateType){
    const dialogRef = this.matDialog.open(DialogNewVariableComponent,{
      data: {
        variable
      }
    })

    dialogRef.afterClosed().subscribe((data:any) => {
      if(data){
        const index = this.templateTypesVariables.findIndex(x => x.section === variable?.section && x.name === variable.name)
        const indexAdded = this.templateTypesVariablesAdded.findIndex(x => x.section === variable?.section && x.name === variable.name)

        if(index > -1){
          this.templateTypesVariables[index] = data
          this.templateTypesVariablesAdded[indexAdded] = data
        }
        else{
          this.templateTypesVariablesAdded.push(data)
          this.templateTypesVariables.push(data)
        }

        if(data.openAnother) this.openDialogVariables({...data,name:''})
      }
    })

  }

  isVariableAdded(variable:VariableDocumentTemplateType){
    return this.templateTypesVariablesAdded.filter(x => x.section === variable.section && x.name === variable.name).length > 0 ? true : false
  }

  addVariable(variable:VariableDocumentTemplateType){
    this.templateTypesVariablesAdded.push(variable)
  }

  deleteVariable(variable:VariableDocumentTemplateType){

    const index = this.templateTypesVariables.findIndex(x => x.section === variable?.section && x.name === variable.name)
    if(index > -1 ) this.templateTypesVariables.splice(index,1)

    this.deleteVariableAdded(variable)
  }

  deleteVariableAdded(variable:VariableDocumentTemplateType){

    const index = this.templateTypesVariablesAdded.findIndex(x => x.section === variable?.section && x.name === variable.name)
    if(index > -1 ) this.templateTypesVariablesAdded.splice(index,1)
  }

  submitForm(){
    this.templateTypesVariablesOutput.emit(this.templateTypesVariablesAdded.filter(x => x.casefile_type === null || x.casefile_type === '' || !x.casefile_type))
  }

}
