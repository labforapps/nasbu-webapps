import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VariableDocumentTemplateType } from 'core-models';
import { DialogNewVariableComponent } from 'projects/practice-app/src/app/components/dialogs/dialog-new-variable/dialog-new-variable.component';

@Component({
  selector: 'app-create-templates-types-variables',
  templateUrl: './create-templates-types-variables.component.html',
  styleUrls: ['./create-templates-types-variables.component.scss']
})
export class CreateTemplatesTypesVariablesComponent implements OnInit {

  @Output() templateTypesVariablesOutput = new EventEmitter<VariableDocumentTemplateType[]>()
  templateTypesVariables:VariableDocumentTemplateType[] = []

  constructor(private matDialog:MatDialog) { }

  ngOnInit(): void {
  }

  openDialogVariables(){
    const dialogRef = this.matDialog.open(DialogNewVariableComponent)

    dialogRef.afterClosed().subscribe(data => {
      if(data) this.templateTypesVariables.push(data)
    })

  }

  submitForm(){
    this.templateTypesVariablesOutput.emit(this.templateTypesVariables)
  }

}
