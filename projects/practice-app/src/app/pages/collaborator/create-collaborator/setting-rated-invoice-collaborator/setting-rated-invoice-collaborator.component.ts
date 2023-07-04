import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-setting-rated-invoice-collaborator',
  templateUrl: './setting-rated-invoice-collaborator.component.html',
  styleUrls: ['./setting-rated-invoice-collaborator.component.scss']
})
export class SettingRatedInvoiceCollaboratorComponent implements OnInit {

  invoicingParameterForm!:FormGroup;


  constructor(private formBuilder:FormBuilder,) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.invoicingParameterForm = this.formBuilder.group({
      price_per_hour:      [''],
      increment_factor:    ['Minuto'],
      price_per_increment: [''],
      allow_retainers:     [false],
      allow_flat_fee:      [false]
    })

    this.invoicingParameterForm.valueChanges.subscribe(val => {
    });

  }

}
