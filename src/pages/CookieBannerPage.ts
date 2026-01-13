import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CookieBannerPage extends BasePage {
  // Selectors
  private readonly cookieBanner: Locator;
  private readonly okButton: Locator;
  private readonly changeSettingsButton: Locator;
  private readonly cookieBannerTitle: Locator;
  private readonly cookieBannerMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cookieBanner = page.locator('.cc-nb-main-container');
    this.okButton = page.locator('.cc-nb-okagree');
    this.changeSettingsButton = page.locator('.cc-nb-changep');
    this.cookieBannerTitle = page.locator('#cc-nb-title');
    this.cookieBannerMessage = page.locator('#cc-nb-text');
  }

  async isCookieBannerVisible(): Promise<boolean> {
    try {
      await this.cookieBanner.waitFor({ state: 'visible', timeout: this.timeout });
      return await this.cookieBanner.isVisible();
    } catch (error) {
      return false;
    }
  }

  async waitForCookieBanner(): Promise<void> {
    await this.cookieBanner.waitFor({ state: 'visible', timeout: this.timeout });
  }

  async acceptCookies(): Promise<void> {
    try {
      if (await this.isCookieBannerVisible()) {
        await this.okButton.waitFor({ state: 'visible', timeout: this.timeout });
        await this.okButton.click();
        await this.waitForCookieBannerToDisappear();
      }
    } catch (error) {
      console.log('Cookie banner not present or already accepted');
    }
  }

  async changeSettings(): Promise<void> {
    await this.changeSettingsButton.waitFor({ state: 'visible', timeout: this.timeout });
    await this.changeSettingsButton.click();
  }

  async isCookieBannerDisappeared(): Promise<boolean> {
    try {
      await this.cookieBanner.waitFor({ state: 'hidden', timeout: this.timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  async waitForCookieBannerToDisappear(): Promise<void> {
    await this.cookieBanner.waitFor({ state: 'hidden', timeout: this.timeout });
  }

  async getCookieBannerTitle(): Promise<string> {
    await this.cookieBannerTitle.waitFor({ state: 'visible', timeout: this.timeout });
    return await this.cookieBannerTitle.textContent() || '';
  }

  async getCookieBannerMessage(): Promise<string> {
    await this.cookieBannerMessage.waitFor({ state: 'visible', timeout: this.timeout });
    return await this.cookieBannerMessage.textContent() || '';
  }

  async isOkButtonVisible(): Promise<boolean> {
    try {
      return await this.okButton.isVisible() && await this.okButton.isEnabled();
    } catch (error) {
      return false;
    }
  }

  async isChangeSettingsButtonVisible(): Promise<boolean> {
    try {
      return await this.changeSettingsButton.isVisible() && await this.changeSettingsButton.isEnabled();
    } catch (error) {
      return false;
    }
  }
}

