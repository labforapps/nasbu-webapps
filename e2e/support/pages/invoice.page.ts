import { expect, Locator, Page } from '@playwright/test';
import { goto } from '../fixtures';
import { contains, exact, t } from '../i18n';
import { NgForm } from './form';

/** Pantalla `#/invoicing`. */
export class InvoicesPage {
  readonly newButton: Locator;

  constructor(private readonly page: Page) {
    this.newButton = page.locator('button.c-btn-function').filter({ hasText: contains('invoicing.new_invoice') });
  }

  async open(): Promise<void> {
    await goto(this.page, 'invoicing');
    await expect(this.page.locator('.l-page__title')).toHaveText(exact('invoicing.title'));
  }
}

/** Formulario `#/invoicing/new-invoice`. */
export class InvoiceFormPage {
  readonly form: NgForm;
  readonly details: Locator;
  readonly total: Locator;
  readonly subtotal: Locator;

  constructor(private readonly page: Page) {
    this.form = new NgForm(page, page.locator('form'));
    // Filas de honorarios (las de reembolso viven en otra tabla con su propio botón).
    this.details = page.locator('tbody[formarrayname="details"]').first().locator('tr:has([formcontrolname="description"])');
    this.subtotal = page.locator('.c-invoice__footer p').filter({ hasText: 'Subtotal' });
    this.total = page.locator('.c-invoice__footer');
  }

  async openFromList(): Promise<void> {
    const list = new InvoicesPage(this.page);
    await list.open();
    await list.newButton.click();
    await expect(this.page).toHaveURL(/invoicing\/new-invoice/);
  }

  async chooseCustomer(name: string): Promise<void> {
    await this.form.select('customer', name);
  }

  async withoutCaseFile(): Promise<void> {
    await this.page.locator('mat-checkbox').filter({ hasText: contains('invoicing.invoice.no_docket') }).click();
  }

  /** Agrega una fila de honorarios de monto fijo. */
  async addFlatFeeItem(description: string, amount: string): Promise<void> {
    const before = await this.details.count();
    await this.page.locator('button.c-btn-add').filter({ hasText: contains('invoicing.invoice.add_new_item') }).first().click();
    await expect(this.details).toHaveCount(before + 1);
    const row = this.details.nth(before);
    const rowForm = new NgForm(this.page, row);
    await rowForm.fill('description', description);
    await rowForm.select('billing_type', t('invoicing.invoice.flat_fee'));
    await rowForm.fill('bt_amt', amount);
    await rowForm.control('bt_amt').press('Tab');
  }

  async save(): Promise<any> {
    const response = this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && /\/accounting\/invoices\/(\?|$)/.test(res.url())
    );
    await this.page.locator('button.c-btn-function').filter({ hasText: contains('invoicing.invoice.save_invoice') }).click();
    return (await response).json();
  }
}
