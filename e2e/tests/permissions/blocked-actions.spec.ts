import { asRole, expect, goto, test } from '../../support/fixtures';
import { ClientFormPage, ClientsPage } from '../../support/pages/clients.page';
import { Shell } from '../../support/pages/shell.page';
import { t } from '../../support/i18n';
import { createCustomer, customerName } from '../../support/data';

// Bloqueos por permiso de rol, plan o límite. Los colaboradores ven datos que crea el owner:
// cada prueba prepara su cliente con la API.

test.describe('Bloqueos – mensaje uniforme (NAS-031)', () => {
  test('BLQ-01 un 403 por permiso muestra el aviso uniforme y no se reintenta', async ({ page, uid, cleanup }) => {
    const form = new ClientFormPage(page);
    await form.open();
    await form.fillPerson({ firstName: `Bloq ${uid}`, lastName: 'E2E', email: `${uid}@e2e.nasbu.test` });
    const created = await form.save();
    cleanup(`catalog/customers/${created.uuid}/`);

    // El backend real ya responde así a quien no tiene `delete_customer`; aquí se simula para
    // probar la reacción del front con el owner, que sí ve el botón.
    let deletes = 0;
    await page.route(`**/catalog/customers/${created.uuid}/**`, (route) => {
      if (route.request().method() !== 'DELETE') return route.continue();
      deletes++;
      return route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'permission_denied', detail: 'forbidden' }),
      });
    });

    const list = new ClientsPage(page);
    await list.filter(uid);
    await (await list.openRowMenu(uid)).click();
    await new Shell(page).confirmAlert();

    const toast = new Shell(page).toast('errorMessages.blockedAction.permission_denied');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(t('errorMessages.blockedAction.title'));
    await page.waitForTimeout(1_500);
    expect(deletes).toBe(1);
    await expect(list.row(uid)).toHaveCount(1);
  });

  test('BLQ-01b un 403 por límite del plan nombra la función y la cantidad', async ({ page, uid }) => {
    const form = new ClientFormPage(page);
    await form.open();
    await form.fillPerson({ firstName: `Lim ${uid}`, lastName: 'E2E', email: `${uid}@e2e.nasbu.test` });
    await page.route('**/catalog/customers/', (route) =>
      route.request().method() === 'POST'
        ? route.fulfill({
            status: 403,
            contentType: 'application/json',
            body: JSON.stringify({ code: 'plan_limit_reached', feature_code: 'customers', contracted: 50 }),
          })
        : route.continue()
    );
    await form.saveButton.click();

    await expect(new Shell(page).toast('errorMessages.blockedAction.features.customers.limit', { contracted: 50 })).toBeVisible();
  });
});

test.describe('Bloqueos – colaborador con escritura sin eliminar (NAS-027)', () => {
  asRole('colabEscritura');

  test('BLQ-07 no ve la opción de eliminar clientes @smoke', async ({ page, api, uid, cleanup }) => {
    const name = customerName(await createCustomer(api, uid, cleanup));
    const list = new ClientsPage(page);
    await list.open();
    await list.filter(uid);
    await expect(list.row(name)).toHaveCount(1);

    await expect(list.editButton(name)).toBeVisible();
    const remove = await list.openRowMenu(name);
    await expect(remove).toHaveCount(0);
  });
});

test.describe('Bloqueos – colaborador de solo lectura', () => {
  asRole('colabLectura');

  test('BLQ-08 no ve crear, editar ni eliminar en clientes', async ({ page, api, uid, cleanup }) => {
    const name = customerName(await createCustomer(api, uid, cleanup));
    const list = new ClientsPage(page);
    await list.open();
    await list.filter(uid);
    await expect(list.row(name)).toHaveCount(1);

    await expect(list.createButton).toHaveCount(0);
    await expect(list.actions(name)).toHaveCount(0);
  });

  test('BLQ-09 entrar por URL a editar un cliente no muestra el formulario', async ({ page, api, uid, cleanup }) => {
    test.fixme(true, 'Activar al mezclar features/NAS-092-permisos-en-toda-la-app (RoutePermissionsGuard)');
    const customer = await createCustomer(api, uid, cleanup);

    await goto(page, `customers/edit/${customer.uuid}`);
    await expect(page).not.toHaveURL(/customers\/edit/);
  });
});

test.describe('Bloqueos por plan (NAS-112, NAS-061)', () => {
  asRole('ownerStarter');

  test.fixme('BLQ-02 una función fuera del plan abre el modal de upgrade, no un toast', async () => {
    // Pendiente NAS-112 (modal de upgrade): hoy el 403 `plan_feature_missing` muestra toast.
  });
  test.fixme('BLQ-03 "Mejorar plan" lleva a la pantalla de cambio de plan', async () => {
    // Pendiente NAS-112.
  });
  test.fixme('BLQ-04 al colaborador el modal le muestra nombre y correo del owner', async () => {
    // Pendiente NAS-112.
  });
  test.fixme('BLQ-05 enviar a firmar con Starter informa "plan sin firma", no un 403', async () => {
    // Activar al mezclar fix/NAS-061-firma-sin-plan.
  });
  test.fixme('BLQ-10 el menú de Reportes solo muestra los reportes permitidos', async () => {
    // Activar al mezclar features/NAS-092-permisos-en-toda-la-app.
  });
});
