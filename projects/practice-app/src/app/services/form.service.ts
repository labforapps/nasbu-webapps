import { Injectable } from '@angular/core';
import { FormArray,FormBuilder,FormGroup } from '@angular/forms';
import { Contact } from 'core-models';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private _formBuilder:FormBuilder) { }

  setFormControlValidations(form:FormGroup,formControlName:string,isRequired:boolean,defaultValue:any){
    if(isRequired){
      form.controls[formControlName].setErrors({incorrect: true})
    }
    else{
      form.controls[formControlName].setErrors(null)
      form.controls[formControlName].setValue(defaultValue)
    }
  }

  returnFormArrayControls(form: FormGroup,formArray:string) {
    return (form.get(formArray) as FormArray).controls;
  }

  addItemFormArray(form:FormGroup,formArray:string,item:any)
  {
    (form.get(formArray) as FormArray).push(
      this._formBuilder.group({
        ...item
      })
    );
  }

  removeItemFormArray(form:FormGroup,formArray: string, index: number) {
    (form.get(formArray) as FormArray).removeAt(index);
  }

  filterFormArray(form:FormGroup,formArray:string,field:string,value:any)
  {
    return (form.get(formArray) as FormArray).controls.filter((control) => {
      return control.get(field)?.value === value;
    });
  }


  deleteContactFormArray(form:FormGroup,contact:Contact)
  {
    const indexToRemove = this.returnIndexFormArrayContact(form,contact);
    (form.get('contacts') as FormArray).removeAt(indexToRemove);
  }

  returnIndexFormArrayContact(form:FormGroup, contact:any)
  {
    const contactArray = (form.get('contacts') as FormArray).controls.filter((control) => {
      return control.get('type')?.value === contact.type
      && control.get('sub_type')?.value === contact.sub_type
      && control.get('contact_value')?.value === contact.contact_value
      && (control.get('contact_id')?.value ? control.get('contact_id')?.value === contact.contact_id : true )
    });

    const index = (form.get('contacts') as FormArray).controls.indexOf(contactArray[0]);

    return index;
  }

  returnIndexFormArrayInvoiceDetail(form:FormGroup, invoice_detail:any)
  {
    const invoiceDetailArray = (form.get('details') as FormArray).controls.filter((control) => {
      return control.get('description')?.value === invoice_detail.description &&
      control.get('is_legal_charge')?.value === invoice_detail.is_legal_charge
    });

    const index = (form.get('details') as FormArray).controls.indexOf(invoiceDetailArray[0]);

    return index;
  }

  returnFormArrayFields(form:FormGroup,formArray: string, index: number, field: string) {
    return (form.get(formArray) as FormArray)
      ?.at(index)
      .get(field);
  }

  returnValueFormField(form:FormGroup,formArray:string,field:string, index: number) {
    return (form.get(formArray) as FormArray)
      ?.at(index)
      .get(field)?.value;
  }

  changeValueCheckboxAddress(form:FormGroup,event: any, index: number) {
    const checked = event.checked;

    if (checked) {
      (form.get('addresses') as FormArray)
        ?.at(index)
        .patchValue({
          postal_city: (form.get('addresses') as FormArray)
            ?.at(index)
            .get('physical_city')?.value,
          postal_address: (form.get('addresses') as FormArray)
            ?.at(index)
            .get('physical_address')?.value,
          postal_postal_code: (
            form.get('addresses') as FormArray
          )
            ?.at(index)
            .get('physical_postal_code')?.value,
        });
    } else {
      (form.get('addresses') as FormArray)
        ?.at(index)
        .patchValue({
          postal_city: '',
          postal_address: '',
          postal_postal_code: '',
        });
    }
  }

  setDataFormArray(form:FormGroup,formArray:string,arrayObject:any)
  {
    for (let i = 0; i < arrayObject.length; i++) {
      (form.get(formArray) as FormArray).push(
        this._formBuilder.group({
          ...arrayObject[i],
        })
      );
    }
  }


}
