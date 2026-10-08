import { FormBuilder } from '@angular/forms';
import { CaseFile, SecurityUser } from 'core-models';

import { DialogNewTaskComponent } from './dialog-new-task.component';

describe('DialogNewTaskComponent – responsables en expediente privado (NAS-079)', () => {
  const user = (uuid: string) => ({ uuid } as SecurityUser);
  const users = [user('responsable'), user('miembro'), user('ajeno')];

  const privateCase = {
    uuid: 'cf-privado',
    access_type: 'private',
    assigned_to: { uuid: 'responsable' },
    case_file_user_access: [{ subscription_user: 'miembro' }],
  } as unknown as CaseFile;
  const publicCase = { uuid: 'cf-publico', access_type: 'public' } as unknown as CaseFile;

  function buildComponent(dataDialog: any = {}): DialogNewTaskComponent {
    const component = new DialogNewTaskComponent(
      dataDialog, null as any, new FormBuilder(), null as any, null as any, null as any, null as any, null as any, null as any
    );
    component.initForm();
    component.allSecurityUsers = users;
    component.caseFiles = [privateCase, publicCase];
    return component;
  }

  it('en un expediente privado solo ofrece al responsable y a los usuarios con acceso', () => {
    const uuids = DialogNewTaskComponent.assignableUsers(users, privateCase).map(u => u.uuid);

    expect(uuids).toEqual(['responsable', 'miembro']);
  });

  it('en un expediente público o sin expediente ofrece a todos', () => {
    expect(DialogNewTaskComponent.assignableUsers(users, publicCase).length).toBe(3);
    expect(DialogNewTaskComponent.assignableUsers(users, undefined).length).toBe(3);
  });

  it('al cambiar a un expediente privado limpia un responsable que ya no es válido', () => {
    const component = buildComponent();
    component.taskForm.patchValue({ case_file: 'cf-publico', assigned_to: 'ajeno' });
    component.applyAssignableUsers();
    expect(component.taskForm.value.assigned_to).toBe('ajeno');

    component.taskForm.patchValue({ case_file: 'cf-privado' });
    component.onChangeCaseFile('cf-privado');

    expect(component.securityUsers.map(u => u.uuid)).toEqual(['responsable', 'miembro']);
    expect(component.taskForm.value.assigned_to).toBe('');
  });

  it('no limpia un responsable que llega fijado desde la pantalla de origen', () => {
    const component = buildComponent({ securityUser: user('ajeno') });
    component.taskForm.patchValue({ case_file: 'cf-privado', assigned_to: 'ajeno' });

    component.applyAssignableUsers();

    expect(component.taskForm.value.assigned_to).toBe('ajeno');
  });
});
