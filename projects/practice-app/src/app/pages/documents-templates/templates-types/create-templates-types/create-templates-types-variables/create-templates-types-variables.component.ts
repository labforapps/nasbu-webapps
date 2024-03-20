import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentTemplateType, VariableDocumentTemplateType } from 'core-models';
import { DialogNewVariableComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-new-variable/dialog-new-variable.component';

@Component({
  selector: 'app-create-templates-types-variables',
  templateUrl: './create-templates-types-variables.component.html',
  styleUrls: ['./create-templates-types-variables.component.scss']
})
export class CreateTemplatesTypesVariablesComponent implements OnInit {

  @Input() documentTemplateType!:DocumentTemplateType
  @Output() templateTypesVariablesOutput = new EventEmitter<VariableDocumentTemplateType[]>()
  templateTypesVariables!:VariableDocumentTemplateType[]

  constructor(private matDialog:MatDialog) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentTemplateType'] && changes['documentTemplateType'].currentValue) {
      this.documentTemplateType = changes['documentTemplateType'].currentValue
      this.setTemplateTypeVariables()
    }
  }


  setTemplateTypeVariables(){
    if(this.documentTemplateType){
      this.templateTypesVariables = this.documentTemplateType.variables || []
    }
  }

  openDialogVariables(variable?:VariableDocumentTemplateType){
    const dialogRef = this.matDialog.open(DialogNewVariableComponent,{
      data: {
        variable
      }
    })

    dialogRef.afterClosed().subscribe((data:VariableDocumentTemplateType) => {
      if(data){
        const variableFiltered = this.templateTypesVariables.filter(x => x.section === data.section && x.name === data.name)

        if(variableFiltered){
          this.templateTypesVariables = this.templateTypesVariables.filter(x => x.section !== data.section && x.name !== data.name)
          this.templateTypesVariables.push(data)
        }
        else{
          this.templateTypesVariables.push(data)
        }
      }
    })

  }

  deleteVariable(variable:VariableDocumentTemplateType){
    this.templateTypesVariables = this.templateTypesVariables.filter(x => x.uuid !== variable.uuid)
  }

  submitForm(){
    this.templateTypesVariablesOutput.emit(this.templateTypesVariables)
  }

}
