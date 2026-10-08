import { expect, Locator, Page, Request } from '@playwright/test';
import { goto } from '../fixtures';
import { contains, t } from '../i18n';
import { NgForm } from './form';

/** Pantalla `#/task` (Mis tareas). */
export class TasksPage {
  readonly newButton: Locator;
  readonly activeTab: Locator;

  constructor(private readonly page: Page) {
    this.newButton = page.locator('button.c-btn-function').filter({ hasText: new RegExp(t('tasks.newTask'), 'i') });
    this.activeTab = page.locator('mat-tab-body.mat-tab-body-active');
  }

  async open(): Promise<void> {
    await goto(this.page, 'task');
    await expect(this.newButton).toBeVisible();
  }

  /** "Nueva tarea" abre un menú de tipos; se elige el primero salvo que se indique otro. */
  async openNew(type?: string | RegExp): Promise<TaskDialog> {
    await this.newButton.click();
    const items = this.page.locator('.mat-menu-panel .mat-menu-item');
    await (type ? items.filter({ hasText: type }).first() : items.first()).click();
    const dialog = new TaskDialog(this.page);
    await expect(dialog.root).toBeVisible();
    return dialog;
  }

  task(text: string): Locator {
    return this.activeTab.getByText(text);
  }
}

/** Diálogo de nueva tarea. */
export class TaskDialog {
  readonly root: Locator;
  readonly form: NgForm;

  constructor(private readonly page: Page) {
    this.root = page.locator('mat-dialog-container').filter({ has: page.locator('[formcontrolname="assigned_to"]') });
    this.form = new NgForm(page, this.root);
  }

  async chooseCaseFile(customer: string, caseFile: string): Promise<void> {
    await this.form.select('customer', customer);
    await this.form.select('case_file', caseFile);
  }

  /** Nombres que ofrece el selector de responsables. */
  async assignableUsers(): Promise<string[]> {
    await this.form.control('assigned_to').click();
    const panel = this.page.locator('.mat-select-panel').last();
    await expect(panel).toBeVisible();
    const names = (await panel.locator('mat-option').allInnerTexts()).map((n) => n.trim());
    await this.page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    return names;
  }

  async submit(): Promise<{ request: Request; task: any }> {
    const response = this.page.waitForResponse(
      (res) => ['POST', 'PUT'].includes(res.request().method()) && /\/practice\/tasks\//.test(res.url())
    );
    await this.root.locator('mat-dialog-actions button.c-btn--primary').filter({ hasText: contains('tasks.newTaskModal.save') }).click();
    const res = await response;
    return { request: res.request(), task: await res.json() };
  }
}
