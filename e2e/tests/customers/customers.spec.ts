import { expect, goto, test } from '../../support/fixtures';
import { ClientFormPage, ClientsPage } from '../../support/pages/clients.page';
import { Shell } from '../../support/pages/shell.page';

test.describe('Clientes', () => {
  test('CLI-01 crear cliente persona física @smoke', async ({ page, uid, cleanup }) => {
    const form = new ClientFormPage(page);
    await form.open();
    await form.fillPerson({ firstName: `Ana ${uid}`, lastName: 'Prueba', email: `${uid}@e2e.nasbu.test` });
    const created = await form.save();
    cleanup(`catalog/customers/${created.uuid}/`);

    await expect(new Shell(page).toast('successMessages.created_succesfully')).toBeVisible();
    await expect(page).toHaveURL(/#\/customers$/);
    const list = new ClientsPage(page);
    await list.filter(uid);
    await expect(list.row(uid)).toHaveCount(1);
  });

  test('CLI-03 el formulario vacío no se envía', async ({ page }) => {
    const form = new ClientFormPage(page);
    await form.open();
    let posted = false;
    page.on('request', (req) => {
      if (req.method() === 'POST' && req.url().includes('/catalog/customers/')) posted = true;
    });

    await form.saveButton.click();

    await expect(new Shell(page).toast()).toContainText(/Completar campos obligatorios/);
    await expect(page).toHaveURL(/create-client/);
    expect(posted).toBe(false);
  });

  test('CLI-04 "Guardar y crear otro" deja el formulario limpio con Contactos y Correo (NAS-021)', async ({ page, uid, cleanup }) => {
    const form = new ClientFormPage(page);
    await form.open();
    await form.fillPerson({ firstName: `Beto ${uid}`, lastName: 'Prueba', email: `${uid}@e2e.nasbu.test` });
    const created = await form.save(form.saveAndCreateAnotherButton);
    cleanup(`catalog/customers/${created.uuid}/`);

    // Se queda en el formulario, vacío y con los bloques de teléfono y correo visibles.
    await expect(page).toHaveURL(/create-client/);
    await expect(form.form.control('first_name')).toHaveValue('');
    await expect(form.phoneInputs().first()).toBeVisible();
    await expect(form.emailInputs().first()).toBeVisible();
    await expect(form.emailInputs().first()).toHaveValue('');

    // Y se puede crear un segundo cliente con el mismo formulario.
    await form.fillPerson({ firstName: `Caro ${uid}`, lastName: 'Prueba', email: `${uid}b@e2e.nasbu.test` });
    const second = await form.save();
    cleanup(`catalog/customers/${second.uuid}/`);
    expect(second.uuid).toBeTruthy();
  });

  test('CLI-05 editar cliente', async ({ page, uid, cleanup }) => {
    const form = new ClientFormPage(page);
    await form.open();
    await form.fillPerson({ firstName: `Dani ${uid}`, lastName: 'Prueba', email: `${uid}@e2e.nasbu.test` });
    const created = await form.save();
    cleanup(`catalog/customers/${created.uuid}/`);

    await goto(page, `customers/edit/${created.uuid}`);
    await expect(form.form.control('first_name')).toHaveValue(`Dani ${uid}`);
    await form.form.fill('last_name', 'Editado');
    await form.save(page.locator('button.c-btn-function').first());

    const list = new ClientsPage(page);
    await list.open();
    await list.filter(uid);
    await expect(list.row(uid)).toContainText('Editado');
  });

  test('CLI-06 buscar en la lista y estado vacío', async ({ page }) => {
    const list = new ClientsPage(page);
    await list.open();
    await list.filter('zzz-no-existe-e2e');
    await expect(list.rows).toHaveCount(0);
  });

  test('CLI-07 eliminar cliente pide confirmación y lo quita de la lista', async ({ page, uid, cleanup }) => {
    const form = new ClientFormPage(page);
    await form.open();
    await form.fillPerson({ firstName: `Elsa ${uid}`, lastName: 'Prueba', email: `${uid}@e2e.nasbu.test` });
    const created = await form.save();
    cleanup(`catalog/customers/${created.uuid}/`);

    const list = new ClientsPage(page);
    await list.filter(uid);
    const remove = await list.openRowMenu(uid);
    await remove.click();
    const shell = new Shell(page);
    await shell.confirmAlert();

    await expect(shell.toast('successMessages.deleted_successfully')).toBeVisible();
    await expect(list.row(uid)).toHaveCount(0);
  });
});
