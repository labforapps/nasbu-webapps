import { asRole, expect, goto, test } from '../../support/fixtures';
import { credentials } from '../../support/env';
import { LoginPage } from '../../support/pages/login.page';
import { Shell } from '../../support/pages/shell.page';

// Todas estas pruebas parten sin sesión: prueban el login en sí.
asRole(null);

test('AUT-01 iniciar sesión con credenciales válidas @smoke', async ({ page }) => {
  const creds = credentials('ownerUltimate');
  test.skip(!creds, 'Sin credenciales de ownerUltimate');
  const login = new LoginPage(page);
  await login.open();
  await login.signInAndWait(creds!.username, creds!.password);

  await expect(page).toHaveURL(/#\/dashboard/);
  await expect(new Shell(page).menuItem('menu.activity_summary')).toBeVisible();
});

test('AUT-02 contraseña incorrecta muestra error y no entra', async ({ page }) => {
  const creds = credentials('ownerUltimate');
  test.skip(!creds, 'Sin credenciales de ownerUltimate');
  const login = new LoginPage(page);
  await login.open();

  // Con un campo vacío el botón queda deshabilitado.
  await login.email.fill(creds!.username);
  await expect(login.submit).toHaveClass(/c-btn--disable/);

  await login.signIn(creds!.username, `${creds!.password}-incorrecta`);
  await expect(login.error).toBeVisible();
  await expect(page).toHaveURL(/#\/signin$/);
});

test('AUT-03 una ruta protegida sin sesión redirige al login @smoke', async ({ page }) => {
  await goto(page, 'customers');
  await expect(page).toHaveURL(/#\/signin/);
  await expect(new LoginPage(page).email).toBeVisible();
});

test('AUT-04 cerrar sesión vuelve al login y no deja ver datos', async ({ page }) => {
  // Sesión propia: cerrar la compartida invalidaría el storageState de las demás pruebas.
  const creds = credentials('ownerUltimate');
  test.skip(!creds, 'Sin credenciales de ownerUltimate');
  const login = new LoginPage(page);
  await login.open();
  await login.signInAndWait(creds!.username, creds!.password);

  await new Shell(page).logout();
  await goto(page, 'customers');
  await expect(page).toHaveURL(/#\/signin/);
});

test('AUT-11 alta sin pagar no entra al layout', async ({ page }) => {
  const creds = credentials('suscripcionImpaga');
  test.skip(!creds, 'Sin cuenta suscripcionImpaga');
  const login = new LoginPage(page);
  await login.open();
  await login.signIn(creds!.username, creds!.password);

  // La app lo devuelve al checkout de la pasarela o muestra el aviso de pago pendiente.
  await expect(page).not.toHaveURL(/#\/dashboard/, { timeout: 20_000 });
  await expect(new Shell(page).menuItem('menu.clients')).toHaveCount(0);
});
