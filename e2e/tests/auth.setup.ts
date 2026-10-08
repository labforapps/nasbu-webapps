import * as fs from 'fs';
import { test as setup } from '@playwright/test';
import { authFile, credentials, Role, ROLES } from '../support/env';
import { LoginPage } from '../support/pages/login.page';

/**
 * Inicia sesión una vez por cada rol con credenciales y guarda la sesión (cookies de Cognito
 * y `ssid` en localStorage) en .auth/<rol>.json. Las pruebas la reutilizan con `asRole`.
 * Un rol sin credenciales no genera archivo y sus pruebas quedan omitidas, no fallidas.
 *
 * Las cuentas impaga y suspendida no llegan a la app: sus pruebas inician sesión por su cuenta.
 */
const SESSION_ROLES = (Object.keys(ROLES) as Role[]).filter(
  (role) => role !== 'suscripcionImpaga' && role !== 'suscripcionSuspendida'
);

for (const role of SESSION_ROLES) {
  setup(`sesión ${role}`, async ({ page, context }, testInfo) => {
    const creds = credentials(role);
    setup.skip(!creds, `Sin credenciales para ${role}`);
    fs.rmSync(authFile(role), { force: true });

    if (process.env.E2E_MOCK) {
      const mock = await import(process.env.E2E_MOCK);
      await mock.install(context, testInfo);
    }

    const login = new LoginPage(page);
    await login.open();
    await login.signInAndWait(creds!.username, creds!.password);
    await context.storageState({ path: authFile(role) });
  });
}
