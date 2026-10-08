import { FormArray, FormBuilder } from '@angular/forms';
import { TypeContact, TypeCustomer } from 'core-models';

import { CreateClientComponent } from './create-client.component';
import { FormService } from '../../../services/form.service';

describe('CreateClientComponent – Guardar y crear otro (NAS-021)', () => {

  function buildComponent(): CreateClientComponent {
    const component = new CreateClientComponent(
      new FormBuilder(), null as any, null as any, null as any, null as any, null as any, null as any,
      null, null as any, new FormService(new FormBuilder()), null as any
    );
    component.initCreateClientForm();
    return component;
  }

  function contactsOfType(component: CreateClientComponent, type: string) {
    return (component.createClientForm.get('contacts') as FormArray).controls
      .filter(control => control.value.type === type);
  }

  [TypeCustomer.person, TypeCustomer.business].forEach(customerType => {
    it(`tras guardar un cliente ${customerType} el formulario conserva un teléfono y un correo`, () => {
      const component = buildComponent();
      component.setCustomerType(customerType);
      component.createClientForm.patchValue({ first_name: 'Ana', company_name: 'ACME' });
      (component.createClientForm.get('contacts') as FormArray).at(1).patchValue({ contact_value: 'ana@acme.do' });

      component.resetForm();

      expect(contactsOfType(component, TypeContact.phone_number).length).toBe(1);
      expect(contactsOfType(component, TypeContact.email).length).toBe(1);
      expect((component.createClientForm.get('contacts') as FormArray).length).toBe(2);
      expect(component.createClientForm.value.first_name).toBeNull();
      expect(component.createClientForm.value.type).toBe(customerType);
      expect(component.customer_type).toBe(customerType);
    });
  });
});
