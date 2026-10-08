import { FormArray, FormBuilder } from '@angular/forms';
import { TypeContact, SubtypeContact } from 'core-models';

import { CreateCollaboratorComponent } from './create-collaborator.component';

describe('CreateCollaboratorComponent – copiar correo del usuario (NAS-018)', () => {
  let component: CreateCollaboratorComponent;

  beforeEach(() => {
    component = Object.create(CreateCollaboratorComponent.prototype);
    Object.assign(component as any, {
      formBuilder: new FormBuilder(), typeContact: TypeContact, subtypeContact: SubtypeContact, securityUserId: '',
    });
    component.initForm();
  });

  const emailContact = () => (component.collaboratorForm.get('contacts') as FormArray).controls
    .find(control => control.get('type')?.value === TypeContact.email)!;

  it('copia el correo del usuario al correo de contacto vacío', () => {
    component.collaboratorForm.patchValue({ email: ' ana@estudio.do ' });

    component.copyUserEmailToContact();

    expect(emailContact().value.contact_value).toBe('ana@estudio.do');
  });

  it('no pisa un correo de contacto ya escrito', () => {
    emailContact().patchValue({ contact_value: 'personal@gmail.com' });
    component.collaboratorForm.patchValue({ email: 'ana@estudio.do' });

    component.copyUserEmailToContact();

    expect(emailContact().value.contact_value).toBe('personal@gmail.com');
  });

  it('no copia al editar un colaborador existente', () => {
    (component as any).securityUserId = 'su-1';
    component.collaboratorForm.patchValue({ email: 'ana@estudio.do' });

    component.copyUserEmailToContact();

    expect(emailContact().value.contact_value).toBe('');
  });
});
