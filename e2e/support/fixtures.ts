import { test as base, expect, Page } from '@playwright/test';
import { Api } from './api';
import { authFile, hasRole, hasSession, Role, ROLES } from './env';

type TestFixtures = {
  /** API autenticada como el owner de Ultimate, para preparar y limpiar datos. */
  api: Api;
  /** Rol con el que entra la página. `null` para pantallas públicas (login, registro). */
  role: Role | null;
  /** Registra rutas de la API para borrarlas al terminar la prueba, pase o falle. */
  cleanup: (path: string) => void;
  /** Sufijo único para nombres de datos de prueba. */
  uid: string;
};

type WorkerFixtures = {
  apiWorker: Api | null;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  role: ['ownerUltimate', { option: true }],

  storageState: async ({ role }, use, testInfo) => {
    if (!role) {
      await use({ cookies: [], origins: [] });
      return;
    }
    testInfo.skip(!hasSession(role), `Sin sesión para ${role}: definir E2E_${ROLES[role]}_USER y _PASSWORD`);
    await use(authFile(role));
  },

  context: async ({ context }, use, testInfo) => {
    // Gancho para correr el suite contra mocks locales sin tocar las pruebas.
    if (process.env.E2E_MOCK) {
      const mock = await import(process.env.E2E_MOCK);
      await mock.install(context, testInfo);
    }
    await use(context);
  },

  apiWorker: [
    async ({}, use) => {
      const available = hasRole('ownerUltimate') || !!process.env.E2E_API_TOKEN;
      const api = available ? await Api.as('ownerUltimate') : null;
      await use(api);
      await api?.dispose();
    },
    { scope: 'worker' },
  ],

  api: async ({ apiWorker }, use, testInfo) => {
    testInfo.skip(!apiWorker, 'Sin credenciales de ownerUltimate para preparar datos');
    await use(apiWorker!);
  },

  cleanup: async ({ api }, use) => {
    const paths: string[] = [];
    await use((path) => paths.push(path));
    for (const path of paths.reverse()) {
      await api.remove(path);
    }
  },

  uid: async ({}, use, testInfo) => {
    await use(`e2e${Date.now().toString(36)}${testInfo.workerIndex}`);
  },
});

export { expect };

/** Usa la sesión de otro rol en todo el archivo o bloque `describe`. */
export function asRole(role: Role | null): void {
  test.use({ role });
}

/** Navega con el ruteo por hash de la app: `goto(page, 'customers')` abre `/#/customers`. */
export async function goto(page: Page, route: string): Promise<void> {
  await page.goto(`/#/${route.replace(/^[#/]+/, '')}`);
}
