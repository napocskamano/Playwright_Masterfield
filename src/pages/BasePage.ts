import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  protected readonly timeout: number = 30000;

  constructor(page: Page) {
    this.page = page;
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async refreshPage(): Promise<void> {
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `reports/screenshots/${name}.png`, 
      fullPage: true 
    });
  }
}
