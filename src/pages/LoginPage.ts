import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private static readonly LOGIN_PAGE_URL = 'https://eng.digitalbank.masterfield.hu/bank/login';

  // Selectors
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly alertMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('input[placeholder="Enter User Name"], input[name="username"], input#username').first();
    this.passwordField = page.locator('input[placeholder="Enter Password"], input[name="password"], input#password').first();
    this.loginButton = page.locator('button[type="submit"], .btn-primary, button.btn').first();
    this.errorMessage = page.locator('.alert-danger, .alert.alert-danger, div[role="alert"]').first();
    this.alertMessage = page.locator('.alert, div.alert').first();
  }

  async isLoaded(): Promise<void> {
    await this.page.goto(LoginPage.LOGIN_PAGE_URL);
    await this.usernameField.waitFor({ state: 'visible', timeout: this.timeout });
    await this.passwordField.waitFor({ state: 'visible', timeout: this.timeout });
    await this.loginButton.waitFor({ state: 'visible', timeout: this.timeout });
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameField.waitFor({ state: 'visible', timeout: this.timeout });
    await this.usernameField.clear();
    if (username && username.length > 0) {
      await this.usernameField.fill(username);
    }
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordField.waitFor({ state: 'visible', timeout: this.timeout });
    await this.passwordField.clear();
    if (password && password.length > 0) {
      await this.passwordField.fill(password);
    }
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.waitFor({ state: 'visible', timeout: this.timeout });
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      // Wait for either error message or alert message
      const errorVisible = this.errorMessage.isVisible();
      const alertVisible = this.alertMessage.isVisible();
      
      return await Promise.race([errorVisible, alertVisible]);
    } catch (error) {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      // Várunk az alert megjelenésére (akármelyik típus)
      const alert = this.page.locator('.alert, div.alert, [role="alert"]').first();
      await alert.waitFor({ state: 'visible', timeout: 5000 });
      
      const text = await alert.textContent();
      const cleanText = text?.trim() || '';
      
      console.log(`LoginPage.getErrorMessage(): "${cleanText}"`);
      return cleanText;
    } catch (error) {
      console.log('LoginPage.getErrorMessage(): No alert found');
      return '';
    }
  }

  async isOnLoginPage(): Promise<boolean> {
    return (await this.getCurrentUrl()).includes('/login');
  }

  async isLoginButtonVisible(): Promise<boolean> {
    try {
      return await this.loginButton.isVisible();
    } catch (error) {
      return false;
    }
  }
}

