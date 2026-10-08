import { expect, test } from '../../support/fixtures';
import { createCaseFile, createCustomer, customerName, members } from '../../support/data';
import { TasksPage } from '../../support/pages/tasks.page';

function memberName(member: any): string {
  return `${member.user.first_name} ${member.user.last_name}`;
}

test.describe('Tareas', () => {
  test('TAR-01 crear tarea en un expediente y asignarla @smoke', async ({ page, api, uid, cleanup }) => {
    const customer = await createCustomer(api, uid, cleanup);
    const caseFile = await createCaseFile(api, { customer: customer.uuid, name: `Exp ${uid}` }, cleanup);
    const owner = (await members(api)).find((m: any) => m.user?.email === api.user.email);
    test.skip(!owner, 'El owner no aparece entre los miembros de la firma');

    const tasks = new TasksPage(page);
    await tasks.open();
    const dialog = await tasks.openNew();
    await dialog.chooseCaseFile(customerName(customer), caseFile.name);
    await dialog.form.fill('description', `Tarea ${uid}`);
    await dialog.form.select('assigned_to', memberName(owner));
    const { task } = await dialog.submit();
    cleanup(`practice/tasks/${task.uuid}/`);

    await expect(dialog.root).toBeHidden();
    await expect(tasks.task(`Tarea ${uid}`)).toBeVisible();
  });

  test('TAR-03 en un expediente privado solo se ofrecen usuarios con acceso (NAS-079)', async ({ page, api, uid, cleanup }) => {
    const all = await members(api);
    const owner = all.find((m: any) => m.user?.email === api.user.email);
    test.skip(!owner || all.length < 2, 'Se necesitan al menos dos miembros en la firma');

    const customer = await createCustomer(api, uid, cleanup);
    const caseFile = await createCaseFile(
      api,
      { customer: customer.uuid, name: `Priv ${uid}`, access: 'private', assignedTo: owner.uuid },
      cleanup
    );

    const tasks = new TasksPage(page);
    await tasks.open();
    const dialog = await tasks.openNew();
    await dialog.chooseCaseFile(customerName(customer), caseFile.name);

    expect(await dialog.assignableUsers()).toEqual([memberName(owner)]);
  });

  test('TAR-04 el backend rechaza asignar a un usuario sin acceso al expediente privado (NAS-079)', async ({ api, uid, cleanup }) => {
    test.fixme(true, 'Activar cuando fix/NAS-079-tarea-expediente-privado esté en develop de nasbu-core');
    const all = await members(api);
    const owner = all.find((m: any) => m.user?.email === api.user.email);
    const outsider = all.find((m: any) => m.uuid !== owner?.uuid);
    test.skip(!owner || !outsider, 'Se necesitan al menos dos miembros en la firma');

    const customer = await createCustomer(api, uid, cleanup);
    const caseFile = await createCaseFile(
      api,
      { customer: customer.uuid, name: `Priv ${uid}`, access: 'private', assignedTo: owner.uuid },
      cleanup
    );

    const [type] = await api.get('common/task_types/');
    await expect(
      api.post('practice/tasks/', {
        type: type.uuid,
        case_file: caseFile.uuid,
        customer: customer.uuid,
        description: `Tarea ${uid}`,
        assigned_to: outsider.uuid,
        priority: 'low',
      })
    ).rejects.toThrow(/respondió 4\d\d/);
  });

  test.fixme('TAR-02 crear tarea suelta con fecha de vencimiento', async () => {});
  test.fixme('TAR-05 iniciar, pausar y detener el temporizador registra el tiempo (NAS-101)', async () => {
    // Pendiente NAS-101. Usar page.clock para controlar el tiempo transcurrido.
  });
  test.fixme('TAR-06 el temporizador sigue al recargar o cambiar de página (NAS-101)', async () => {});
  test.fixme('TAR-07 temporizador con tareas del mismo nombre en distintos expedientes (NAS-102)', async () => {});
  test.fixme('TAR-08 cerrar tarea con motivo', async () => {});
  test.fixme('TAR-09 filtrar tareas por estado, responsable y vencimiento', async () => {});
  test.fixme('TAR-10 el correo de tarea asignada lleva al destino definido (NAS-067)', async () => {});
});
