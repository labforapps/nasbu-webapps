import { expect, Locator, Page } from '@playwright/test';
import { goto } from '../fixtures';
import { exact, t } from '../i18n';
import { Shell } from './shell.page';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByRole('textbox', { name: t('login.email.label'), exact: true });
    this.password = page.getByRole('textbox', { name: t('login.password.label'), exact: true });
    this.submit = page.getByRole('button', { name: exact('login.signin') });
    this.error = page.locator('.c-login__form .u-dangerColor');
  }

  async open(): Promise<void> {
    await goto(this.page, 'signin');
    await expect(this.email).toBeVisible();
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.email.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }

  /** Inicia sesión y espera a que la app cargue los permisos del usuario. */
  async signInAndWait(username: string, password: string): Promise<void> {
    await this.signIn(username, password);
    await expect(this.page).not.toHaveURL(/#\/signin$/, { timeout: 30_000 });
    await this.page.waitForFunction(() => !!localStorage.getItem('ssid'), null, { timeout: 30_000 });
    await new Shell(this.page).dismissWelcome();
  }
}
