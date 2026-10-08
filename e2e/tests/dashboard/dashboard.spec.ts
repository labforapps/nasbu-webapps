import { expect, goto, test } from '../../support/fixtures';
import { Shell } from '../../support/pages/shell.page';

test.describe('Dashboard', () => {
  test('DSH-01 el dashboard carga sin errores de la aplicación @smoke', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await goto(page, 'dashboard');
    const shell = new Shell(page);
    await expect(shell.menuItem('menu.activity_summary')).toBeVisible();
    await expect(shell.menuItem('menu.clients')).toBeVisible();
    await page.waitForLoadState('networkidle');

    expect(errors, `Errores de JavaScript en el dashboard:\n${errors.join('\n')}`).toEqual([]);
  });

  test.fixme('DSH-02 la bienvenida sale una sola vez en el primer ingreso (NAS-017)', async () => {});
  test.fixme('DSH-03 la bienvenida no vuelve a salir al recargar (NAS-017)', async () => {});
  test.fixme('DSH-04 banner de suscripción según el estado', async () => {});
  test.fixme('DSH-05 indicadores de ahorro y facturas a tiempo (NAS-097, NAS-098)', async () => {});
  test.fixme('DSH-06 tutoriales lista categorías y abre un video', async () => {});
});
