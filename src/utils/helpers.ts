import { Page } from '@playwright/test';

export class Helpers {
  /**
   * Wait for a specified amount of time
   * @param ms milliseconds to wait
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate random string
   * @param length length of the string
   */
  static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    const randomString = this.generateRandomString(10);
    return `test_${randomString}@example.com`;
  }

  /**
   * Take screenshot with timestamp
   * @param page Playwright page object
   * @param name screenshot name
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `reports/screenshots/${name}_${timestamp}.png`, 
      fullPage: true 
    });
  }

  /**
   * Format date to string
   * @param date Date object
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Scroll to element
   * @param page Playwright page object
   * @param selector element selector
   */
  static async scrollToElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }
}

