import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewSavingsAccountPage extends BasePage {
  private accountNameField!: Locator;
  private initialDepositField!: Locator;
  private submitButton!: Locator;
  private resetButton!: Locator;

  constructor(page: Page) {
    super(page);
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/savings-add', { timeout: this.timeout });
      await this.page.waitForSelector('input[type="radio"]', { timeout: this.timeout });
      await this.initElements();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async initElements(): Promise<void> {
    this.accountNameField = this.page.locator('input[type="text"][id*="account" i], input[id*="name" i]').first();
    this.initialDepositField = this.page.locator('#openingBalance');
    this.submitButton = this.page.locator('#newSavingsSubmit');
    this.resetButton = this.page.locator('button[type="reset"]');
  }

  async selectAccountType(accountType: string): Promise<void> {
    const radio = this.page.locator(`input[type="radio"][id*="${accountType}" i]`).first();
    await radio.waitFor({ state: 'visible', timeout: this.timeout });
    
    if (!(await radio.isChecked())) {
      await radio.click();
    }
  }

  async selectOwnership(ownership: string): Promise<void> {
    const radio = this.page.locator(`input[type="radio"][id*="${ownership}" i]`).first();
    await radio.waitFor({ state: 'visible', timeout: this.timeout });
    
    if (!(await radio.isChecked())) {
      await radio.click();
    }
  }

  async enterAccountName(accountName: string): Promise<void> {
    await this.accountNameField.waitFor({ state: 'visible', timeout: this.timeout });
    await this.accountNameField.clear();
    await this.accountNameField.fill(accountName);
  }

  async enterInitialDeposit(amount: string): Promise<void> {
    await this.initialDepositField.waitFor({ state: 'visible', timeout: this.timeout });
    await this.initialDepositField.clear();
    await this.initialDepositField.fill(amount);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible', timeout: this.timeout });
    await this.submitButton.click();
  }

  async resetForm(): Promise<void> {
    await this.resetButton.waitFor({ state: 'visible', timeout: this.timeout });
    await this.resetButton.click();
  }

  async areAllFieldsCleared(): Promise<boolean> {
    await this.accountNameField.waitFor({ state: 'visible', timeout: this.timeout });

    const accountName = await this.accountNameField.inputValue();
    const initialDeposit = await this.initialDepositField.inputValue();

    const accountNameEmpty = !accountName || accountName.length === 0;
    const depositEmpty = !initialDeposit || initialDeposit.length === 0;

    return accountNameEmpty && depositEmpty;
  }

  async fillFormWithTestData(): Promise<void> {
    await this.selectAccountType('Saving');
    await this.selectOwnership('Individual');
    await this.enterAccountName('Test Account');
    await this.enterInitialDeposit('100');
  }

  async getSuccessMessage(): Promise<string> {
    const message = this.page.locator('#new-account-msg');
    await message.waitFor({ state: 'visible', timeout: this.timeout });
    return await message.textContent() || '';
  }

  async getErrorMessage(): Promise<string> {
    const message = this.page.locator('.alert-danger, .alert.alert-danger, div[role="alert"].alert-danger').first();
    await message.waitFor({ state: 'visible', timeout: this.timeout });
    return await message.textContent() || '';
  }
}

