import { expect, Locator, Page } from '@playwright/test';
import { exact, t } from '../i18n';

/** Partes comunes del layout autenticado: menú lateral, encabezado y toasts. */
export class Shell {
  readonly userMenu: Locator;

  constructor(private readonly page: Page) {
    this.userMenu = page.locator('.c-header__user');
  }

  /** Ítem del menú lateral por su clave de traducción (`menu.clients`, `menu.dockets`…). */
  menuItem(key: string): Locator {
    // Los botones del menú no exponen nombre accesible (mat-button con ícono): se filtra por texto.
    return this.page.locator('.c-menu__item').filter({ hasText: exact(key) });
  }

  async goTo(key: string): Promise<void> {
    await this.menuItem(key).click();
  }

  /**
   * Cierra el pop-up de bienvenida del primer ingreso y lo marca como visto.
   * Hoy puede volver a salir en ingresos posteriores (NAS-017), así que el login lo cierra siempre.
   */
  async dismissWelcome(): Promise<void> {
    // El login recarga la página después de navegar: el pop-up puede abrirse dos veces seguidas.
    await this.page.waitForLoadState('load');
    const dialog = this.page.locator('.c-dialog-intake');
    for (let attempt = 0; attempt < 3; attempt++) {
      const shown = await dialog
        .waitFor({ state: 'visible', timeout: 4_000 })
        .then(() => true)
        .catch(() => false);
      if (!shown) {
        break;
      }
      await dialog.locator('[mat-dialog-close]:visible').first().click();
      await dialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
    }
    await expect(dialog).toBeHidden();
    // Al cerrar la bienvenida el layout abre el menú de primeros pasos: se cierra también.
    const backdrop = this.page.locator('.cdk-overlay-backdrop-showing');
    if (await backdrop.first().isVisible().catch(() => false)) {
      await this.page.keyboard.press('Escape');
      await expect(backdrop).toHaveCount(0);
    }
    await this.page.evaluate(() => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('first_login_'))
        .forEach((key) => localStorage.setItem(key, 'false'));
    });
  }

  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.page.locator('.mat-menu-item').filter({ hasText: /logout/i }).click();
    await expect(this.page).toHaveURL(/#\/signin/);
  }

  /** Toast de ngx-toastr. Con `key` filtra por el texto traducido. */
  toast(key?: string, params?: Record<string, string | number>): Locator {
    const toasts = this.page.locator('#toast-container .ngx-toastr, .toast-container .ngx-toastr');
    return key ? toasts.filter({ hasText: t(key, params) }) : toasts;
  }

  /** Confirma el diálogo de SweetAlert2 (eliminar, cambiar plan…). */
  async confirmAlert(): Promise<void> {
    const popup = this.page.locator('.swal2-popup');
    await expect(popup).toBeVisible();
    await popup.locator('.swal2-confirm').click();
    await expect(popup).toBeHidden();
  }

  /** Esperar a que la app termine de cargar (spinner global oculto). */
  async idle(): Promise<void> {
    await expect(this.page.locator('ngx-spinner .ngx-spinner-overlay')).toHaveCount(0, { timeout: 20_000 });
  }
}
