import { expect, Locator, Page } from '@playwright/test';

/**
 * Ayudas para formularios reactivos de Angular Material.
 * Los controles se ubican por `formcontrolname`, que es el contrato estable entre la plantilla y el
 * componente; las etiquetas visibles cambian más seguido y varias pantallas no las asocian al input.
 */
export class NgForm {
  constructor(private readonly page: Page, private readonly scope: Locator = page.locator('body')) {}

  control(name: string, index = 0): Locator {
    return this.scope.locator(`[formcontrolname="${name}"]`).nth(index);
  }

  async fill(name: string, value: string, index = 0): Promise<void> {
    await this.control(name, index).fill(value);
  }

  /** Abre un mat-select y elige la opción por texto, o la primera habilitada si no se indica. */
  async select(name: string, option?: string | RegExp, index = 0): Promise<string> {
    await this.control(name, index).click();
    const panel = this.page.locator('.mat-select-panel').last();
    await expect(panel).toBeVisible();
    const options = panel.locator('mat-option:not(.mat-option-disabled)');
    const target = option ? options.filter({ hasText: option }).first() : options.first();
    const text = (await target.innerText()).trim();
    await target.click();
    // Algunas pantallas reabren el foco del select tras `selectionChange`: se cierra con Escape.
    const closed = await panel.waitFor({ state: 'hidden', timeout: 2_000 }).then(() => true).catch(() => false);
    if (!closed) {
      await this.page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
    }
    return text;
  }

  async selectedText(name: string, index = 0): Promise<string> {
    return (await this.control(name, index).locator('.mat-select-value').innerText()).trim();
  }
}
