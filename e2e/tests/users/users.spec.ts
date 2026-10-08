import { asRole, expect, test } from '../../support/fixtures';
import { Shell } from '../../support/pages/shell.page';
import { UserFormPage, UsersPage } from '../../support/pages/users.page';

test.describe('Usuarios', () => {
  test('USR-02 el correo de acceso se copia al correo de contacto (NAS-018)', async ({ page, uid }) => {
    const form = new UserFormPage(page);
    await form.open();

    await form.loginEmail.fill(`${uid}@e2e.nasbu.test`);
    await form.loginEmail.blur();
    await expect(form.contactEmail).toHaveValue(`${uid}@e2e.nasbu.test`);

    // Si el contacto ya tiene un correo distinto, no se pisa.
    await form.contactEmail.fill('otro@e2e.nasbu.test');
    await form.loginEmail.fill(`${uid}x@e2e.nasbu.test`);
    await form.loginEmail.blur();
    await expect(form.contactEmail).toHaveValue('otro@e2e.nasbu.test');
  });

  test.fixme('USR-01 crear colaborador con rol', async () => {
    // Pendiente: crear un usuario en QA envía la invitación real de Cognito y consume una licencia.
    // Requiere un buzón de prueba y una cuenta con licencias libres que se limpie al terminar.
  });
});

test.describe('Usuarios – límite del plan', () => {
  asRole('ownerLimite');

  test('BLQ-06 "Crear nuevo usuario" con el límite alcanzado avisa y no abre el formulario (NAS-020)', async ({ page }) => {
    const users = new UsersPage(page);
    await users.open();
    await users.createButton.click();

    await expect(new Shell(page).toast('collaborator.users_limit_reached')).toBeVisible();
    await expect(page).toHaveURL(/#\/users$/);
  });
});
