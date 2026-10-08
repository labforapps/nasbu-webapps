import { expect, Locator, Page, Request } from '@playwright/test';
import { goto } from '../fixtures';
import { contains, exact, t } from '../i18n';
import { NgForm } from './form';

/** Pantalla `#/expedient`. */
export class ExpedientsPage {
  readonly newButton: Locator;
  readonly search: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.newButton = page.locator('.l-page__header button.c-btn-function, button.c-btn-function').filter({ hasText: contains('dockets.new_docket') }).first();
    this.search = page.locator('mat-tab-body.mat-tab-body-active').getByPlaceholder(t('dockets.search_by_name'));
    this.rows = page.locator('mat-tab-body.mat-tab-body-active tr.mat-row:not(:has(td[colspan]))');
  }

  async open(): Promise<void> {
    await goto(this.page, 'expedient');
    await expect(this.page.locator('.l-page__title')).toHaveText(exact('dockets.dockets'));
  }

  async filter(text: string): Promise<void> {
    await this.search.fill(text);
    await this.search.press('End');
  }

  row(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  async openNew(): Promise<ExpedientDialog> {
    await this.newButton.click();
    const dialog = new ExpedientDialog(this.page);
    await expect(dialog.root).toBeVisible();
    return dialog;
  }
}

/** Diálogo "Nuevo expediente". */
export class ExpedientDialog {
  readonly root: Locator;
  readonly form: NgForm;

  constructor(private readonly page: Page) {
    this.root = page.locator('mat-dialog-container').filter({ hasText: t('dockets.form.new_docket') });
    this.form = new NgForm(page, this.root);
  }

  async fill(data: { name: string; customer: string; pricePerHour: string; private?: boolean; assignTo?: string }): Promise<void> {
    await this.form.fill('name', data.name);
    await this.form.select('customer', data.customer);
    if (data.assignTo) {
      await this.form.select('assigned_to', data.assignTo);
    }
    if (data.private) {
      await this.root.locator('mat-radio-button').filter({ hasText: 'Privado' }).click();
    }
    await this.root.locator('mat-checkbox[formcontrolname="hourly_rate"] label').click();
    await this.form.fill('bt_price_per_hour', data.pricePerHour);
  }

  /** Envía y devuelve la petición de creación (para revisar el payload) y el expediente creado. */
  async submit(): Promise<{ request: Request; caseFile: any }> {
    const response = this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && /\/practice\/case_files\/(\?|$)/.test(res.url())
    );
    await this.root.locator('button.c-btn-function').filter({ hasText: 'Crear Expediente' }).click();
    const res = await response;
    return { request: res.request(), caseFile: await res.json() };
  }
}
