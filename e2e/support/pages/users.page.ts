import { expect, Locator, Page } from '@playwright/test';
import { goto } from '../fixtures';
import { contains, exact } from '../i18n';
import { NgForm } from './form';

/** Pantalla `#/users`: usuarios y colaboradores de la firma. */
export class UsersPage {
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.createButton = page.locator('button.c-btn-function').filter({ hasText: contains('collaborator.buttons.create_new_collaborator') });
  }

  async open(): Promise<void> {
    await goto(this.page, 'users');
    await expect(this.page.locator('.l-page__title')).toHaveText(exact('collaborator.title'));
  }
}

/** Formulario `#/user/create`. */
export class UserFormPage {
  readonly form: NgForm;

  constructor(private readonly page: Page) {
    this.form = new NgForm(page, page.locator('form'));
  }

  async open(): Promise<void> {
    await goto(this.page, 'user/create');
    await expect(this.form.control('email')).toBeVisible();
  }

  /** Correo de acceso del usuario (el primer control `email`). */
  get loginEmail(): Locator {
    return this.form.control('email');
  }

  /** Correo de contacto (el `contact_value` del bloque de correos). */
  get contactEmail(): Locator {
    return this.page.locator('[formarrayname="contacts"] input[formcontrolname="contact_value"]').first();
  }
}
