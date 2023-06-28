import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoicing-parameters',
  templateUrl: './invoicing-parameters.component.html',
  styleUrls: ['./invoicing-parameters.component.scss']
})
export class InvoicingParametersComponent implements OnInit {

  invoicingParameterForm!:FormGroup;

  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.invoicingParameterForm = this.formBuilder.group({
      price_per_hour:      [''],
      increment_factor:    [''],
      price_per_increment: [''],
      allow_retainers:     [false],
      allow_flat_fee:      [false]
    })
  }

  submitForm(){
    console.log(this.invoicingParameterForm.value);
  }



}
