import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CaseFile, VariableCaseFileType, VariableDocumentTemplateType } from 'core-models';

@Component({
  selector: 'app-expedient-variables-info',
  templateUrl: './expedient-variables-info.component.html',
  styleUrls: ['./expedient-variables-info.component.scss']
})
export class ExpedientVariablesInfoComponent implements OnInit {

  @Input() caseFile!:CaseFile
  variablesForm!:FormGroup;
  selectedSubscription!:any;
  variablesSections:string[] = []
  caseFileVariablesType:VariableCaseFileType[] = []
  variables:VariableDocumentTemplateType[] | VariableCaseFileType[] = []

  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.variablesForm = this.formBuilder.group({})
    this.setVariablesInfo()
  }

  setVariablesInfo(){

    const variables:any = JSON.parse( this.caseFile.custom_variables_data || '')

    Object.keys(variables).forEach(section => {
      Object.keys(variables[section]).forEach(name => {
            this.caseFileVariablesType.push({
              section: section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convertir snake-case a Título
              name: name,
              value_path: `custom.${section}.${name}`,
          });

          this.variablesForm.addControl(`custom.${section}.${name}`,this.formBuilder.control(`${variables[section][name]}`))

      });
  });

     this.variablesSections = [...new Set( this.caseFileVariablesType ? this.caseFileVariablesType.map((item:any) => item.section) : '')]

  }

}
