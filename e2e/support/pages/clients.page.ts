import { expect, Locator, Page, Response } from '@playwright/test';
import { goto } from '../fixtures';
import { contains, exact, t } from '../i18n';
import { NgForm } from './form';

export interface PersonData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

/** Pantalla `#/customers`: lista de clientes. */
export class ClientsPage {
  readonly createButton: Locator;
  readonly search: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.createButton = page.locator('.l-page__header button, button').filter({ hasText: contains('clients.header.button_create_client') }).first();
    this.search = page.getByPlaceholder(t('clients.table.table_header.search_placeholder')).first();
    // Excluye la fila de "sin datos" (una sola celda con colspan).
    this.rows = page.locator('mat-tab-body.mat-tab-body-active tr.mat-row:not(:has(td[colspan]))');
  }

  async open(): Promise<void> {
    await goto(this.page, 'customers');
    await expect(this.page.locator('.l-page__title')).toHaveText(exact('clients.header.title'));
  }

  row(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  async filter(text: string): Promise<void> {
    // El filtro escucha `keyup`, no `input`.
    await this.search.fill(text);
    await this.search.press('End');
  }

  /** Botón "Editar" de la fila (solo con `change_customer`). */
  editButton(text: string): Locator {
    return this.row(text).locator('mat-button-toggle').filter({ hasText: exact('clients.table.buttons.edit') });
  }

  /** Abre el desplegable de la fila y devuelve la opción "Eliminar" (solo con `delete_customer`). */
  async openRowMenu(text: string): Promise<Locator> {
    await this.row(text).locator('mat-button-toggle').last().click();
    return this.page.locator('.mat-menu-panel .mat-menu-item').filter({ hasText: contains('clients.table.buttons.delete') });
  }

  /** Columna de acciones de la fila: vacía cuando el rol no tiene `change_` ni `delete_customer`. */
  actions(text: string): Locator {
    return this.row(text).locator('mat-button-toggle-group');
  }
}

/** Formulario `#/customers/create-client` y `#/customers/edit/:id`. */
export class ClientFormPage {
  readonly form: NgForm;
  readonly saveButton: Locator;
  readonly saveAndCreateAnotherButton: Locator;

  constructor(private readonly page: Page) {
    this.form = new NgForm(page, page.locator('form'));
    this.saveButton = page.locator('button.c-btn-function').filter({ hasText: contains('clients.form_create.save_customer') });
    this.saveAndCreateAnotherButton = page.locator('button.c-btn-function').filter({ hasText: contains('clients.form_create.save_create_another') });
  }

  async open(): Promise<void> {
    // Se entra desde la lista: `customers/create-client` está fuera del layout y, al abrirlo por
    // URL en una carga nueva, su guard evalúa los permisos antes de que se carguen y redirige a `/`.
    const list = new ClientsPage(this.page);
    await list.open();
    await list.createButton.click();
    await expect(this.page.locator('.c-create__title')).toHaveText(exact('clients.form_create.create_new_customer'));
  }

  async chooseType(type: 'person' | 'business'): Promise<void> {
    const key = type === 'person' ? 'clients.common.person' : 'clients.common.business';
    await this.page
      .locator('.c-toggleOptions__item, .c-toggleOptions > *')
      .filter({ has: this.page.locator('.c-toggleOptions__title', { hasText: exact(key) }) })
      .locator('.c-toggleOptions__icon')
      .first()
      .click();
  }

  /** Inputs del bloque de teléfono (componente ngx-intl-tel-input). */
  phoneInputs(): Locator {
    return this.page.locator('ngx-intl-tel-input input.c-form-group__input');
  }

  /** Inputs del bloque de correo: los `contact_value` que no son de teléfono. */
  emailInputs(): Locator {
    return this.page.locator('[formarrayname="contacts"] input[formcontrolname="contact_value"]');
  }

  async fillPerson(data: PersonData): Promise<void> {
    await this.chooseType('person');
    await this.form.fill('first_name', data.firstName);
    await this.form.fill('last_name', data.lastName);
    await this.form.select('marital_status', t('clients.form_create.single'));
    await this.form.select('occupation');
    await this.phoneInputs().first().fill(data.phone ?? '2025550123');
    await this.emailInputs().first().fill(data.email);
    await this.fillAddress();
  }

  /** Dirección física y la misma como postal (casilla "comparte información"). */
  async fillAddress(): Promise<void> {
    await this.form.select('physical_country');
    await this.form.fill('physical_state', 'Distrito Nacional');
    await this.form.fill('physical_city', 'Santo Domingo');
    await this.form.fill('physical_address', 'Av. Winston Churchill 1');
    await this.form.fill('physical_postal_code', '10148');
    await this.page.locator('mat-checkbox').filter({ hasText: contains('collaborator.form_create.physical_postal_address_share_info') }).first().click();
  }

  /** Guarda y devuelve el cliente creado según la respuesta de la API. */
  async save(button: Locator = this.saveButton): Promise<any> {
    const response = this.page.waitForResponse(isCustomerSave);
    await button.click();
    return (await response).json();
  }
}

function isCustomerSave(res: Response): boolean {
  const method = res.request().method();
  return /\/catalog\/customers\/([^/?]+\/)?(\?|$)/.test(res.url()) && (method === 'POST' || method === 'PATCH');
}
