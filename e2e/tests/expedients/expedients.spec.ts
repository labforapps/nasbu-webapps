import { asRole, expect, goto, test } from '../../support/fixtures';
import { createCaseFile, createCustomer, customerName, members } from '../../support/data';
import { ExpedientsPage } from '../../support/pages/expedients.page';
import { Shell } from '../../support/pages/shell.page';

test.describe('Expedientes', () => {
  test('EXP-01 crear expediente por hora @smoke', async ({ page, api, uid, cleanup }) => {
    const customer = await createCustomer(api, uid, cleanup);
    const list = new ExpedientsPage(page);
    await list.open();
    const dialog = await list.openNew();
    await dialog.fill({ name: `Exp ${uid}`, customer: customerName(customer), pricePerHour: '150' });
    const { caseFile } = await dialog.submit();
    cleanup(`practice/case_files/${caseFile.uuid}/`);

    await expect(new Shell(page).toast('successMessages.created_succesfully')).toBeVisible();
    await list.filter(uid);
    await expect(list.row(`Exp ${uid}`)).toHaveCount(1);
  });

  test('EXP-02 un monto con coma de miles se guarda como número (NAS-024)', async ({ page, api, uid, cleanup }) => {
    const customer = await createCustomer(api, uid, cleanup);
    const list = new ExpedientsPage(page);
    await list.open();
    const dialog = await list.openNew();
    await dialog.fill({ name: `Exp ${uid}`, customer: customerName(customer), pricePerHour: '1,500.00' });
    const { request, caseFile } = await dialog.submit();
    cleanup(`practice/case_files/${caseFile.uuid}/`);

    const payload = request.postDataJSON();
    expect(Number(payload.bt_price_per_hour)).toBe(1500);
    expect(Number(payload.bt_amt)).toBe(1500);
  });

  test('EXP-02b un monto mal escrito avisa en lugar de enviarse', async ({ page, api, uid, cleanup }) => {
    const customer = await createCustomer(api, uid, cleanup);
    const list = new ExpedientsPage(page);
    await list.open();
    const dialog = await list.openNew();
    await dialog.fill({ name: `Exp ${uid}`, customer: customerName(customer), pricePerHour: '1.500,00' });
    await dialog.root.locator('button.c-btn-function').filter({ hasText: 'Crear Expediente' }).click();

    await expect(new Shell(page).toast()).toContainText(/Revisa los montos/);
    await expect(dialog.root).toBeVisible();
  });
});

test.describe('Expedientes privados', () => {
  asRole('colabSinExpediente');

  test('EXP-04 un expediente privado no aparece a quien no tiene acceso', async ({ page, api, uid, cleanup }) => {
    const customer = await createCustomer(api, uid, cleanup);
    const owner = (await members(api)).find((m: any) => m.user?.email === api.user.email);
    await createCaseFile(
      api,
      { customer: customer.uuid, name: `Priv ${uid}`, access: 'private', assignedTo: owner?.uuid },
      cleanup
    );

    const list = new ExpedientsPage(page);
    await list.open();
    await list.filter(uid);
    await expect(list.row(`Priv ${uid}`)).toHaveCount(0);
  });

  test('EXP-05 entrar por URL a un expediente privado sin acceso no muestra su contenido (NAS-038)', async ({ page, api, uid, cleanup }) => {
    test.fixme(true, 'Activar al mezclar fix/NAS-038-acceso-reportes');
    const customer = await createCustomer(api, uid, cleanup);
    const owner = (await members(api)).find((m: any) => m.user?.email === api.user.email);
    const caseFile = await createCaseFile(
      api,
      { customer: customer.uuid, name: `Priv ${uid}`, access: 'private', assignedTo: owner?.uuid },
      cleanup
    );

    await goto(page, `expedient-info/${caseFile.uuid}`);
    await expect(page.getByText(`Priv ${uid}`)).toHaveCount(0);
  });
});

test.describe('Expedientes – pendientes', () => {
  test.fixme('EXP-03 expediente por monto fijo e incremento de tiempo', async () => {});
  test.fixme('EXP-06 agregar nota al expediente', async () => {});
  test.fixme('EXP-07 subir documento al expediente', async () => {});
  test.fixme('EXP-08 generar documento desde plantilla', async () => {});
  test.fixme('EXP-09 registrar horas manuales', async () => {});
  test.fixme('EXP-10 cerrar expediente con motivo y fecha de cierre propia', async () => {});
  test.fixme('EXP-11 crear tipo de expediente con variables', async () => {});
  test.fixme('EXP-12 editar y eliminar expediente según permisos', async () => {});
});
