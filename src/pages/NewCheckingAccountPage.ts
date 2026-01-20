import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewCheckingAccountPage extends BasePage {
  // Selectors
  private readonly accountNameInput: Locator;
  private readonly initialDepositInput: Locator;
  private readonly submitButton: Locator;
  private readonly resetButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // The checking form has specific structure - find textboxes within the form
    // The form is at the bottom of the page, so we filter to find visible textboxes
    const formLocator = page.locator('form').last(); // The checking form is the last form on the page
    this.accountNameInput = formLocator.locator('input[type="text"]').nth(0);
    this.initialDepositInput = formLocator.locator('input[type="text"]').nth(1);
    this.submitButton = page.locator('button:has-text("Submit")');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.errorMessage = page.locator('.alert-danger, .alert.alert-danger, div[role="alert"].alert-danger');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/checking-add', { timeout: this.timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  async selectAccountType(accountType: string): Promise<void> {
    // Checking form uses radio buttons, not select dropdowns
    const radioButton = this.page.locator(`input[type="radio"][value*="${accountType}"], label:has-text("${accountType}") input[type="radio"]`).first();
    await radioButton.waitFor({ state: 'visible', timeout: this.timeout });
    await radioButton.click();
  }

  async selectOwnership(ownership: string): Promise<void> {
    // Checking form uses radio buttons, not select dropdowns
    const radioButton = this.page.locator(`input[type="radio"][value*="${ownership}"], label:has-text("${ownership}") input[type="radio"]`).first();
    await radioButton.waitFor({ state: 'visible', timeout: this.timeout });
    await radioButton.click();
  }

  async enterAccountName(accountName: string): Promise<void> {
    await this.accountNameInput.waitFor({ state: 'visible', timeout: this.timeout });
    await this.accountNameInput.fill(accountName);
  }

  async enterInitialDeposit(amount: string): Promise<void> {
    await this.initialDepositInput.waitFor({ state: 'visible', timeout: this.timeout });
    await this.initialDepositInput.fill(amount);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible', timeout: this.timeout });
    await this.submitButton.click();
  }

  async resetForm(): Promise<void> {
    await this.resetButton.waitFor({ state: 'visible', timeout: this.timeout });
    await this.resetButton.click();
  }

  async areFieldsCleared(): Promise<boolean> {
    const nameValue = await this.accountNameInput.inputValue();
    const depositValue = await this.initialDepositInput.inputValue();
    return nameValue === '' && depositValue === '';
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: this.timeout });
      return await this.errorMessage.textContent() || '';
    } catch (error) {
      return '';
    }
  }

  async fillForm(accountType: string, ownership: string, accountName: string, initialDeposit: string): Promise<void> {
    await this.selectAccountType(accountType);
    await this.selectOwnership(ownership);
    await this.enterAccountName(accountName);
    await this.enterInitialDeposit(initialDeposit);
  }
}

