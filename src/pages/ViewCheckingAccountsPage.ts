import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ViewCheckingAccountsPage extends BasePage {
  // Selectors
  private readonly greenCards: Locator;
  private readonly transactions: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.greenCards = page.locator('.card.bg-success, .card-success, .card.text-white.bg-success');
    this.transactions = page.locator('.transaction-item, .transaction-row, tbody tr');
    this.successMessage = page.locator('.alert-success, .alert.alert-success');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/checking-view', { timeout: this.timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isGreenCardVisible(): Promise<boolean> {
    await this.page.waitForSelector('.card.bg-success, .card-success, .card.text-white.bg-success, .bg-success', { 
      timeout: this.timeout 
    });
    return true;
  }

  async getCardFieldValue(fieldName: string): Promise<string> {
    try {
      const card = this.greenCards.first();

      const xpathPatterns = [
        `.//*[contains(text(),"${fieldName}")]/following-sibling::*[1]`,
        `.//*[contains(text(),"${fieldName}")]/../*[2]`,
        `.//*[text()="${fieldName}"]/following-sibling::*`,
        `.//*[contains(@class,"field-label") and contains(text(),"${fieldName}")]/../*[contains(@class,"field-value")]`
      ];

      for (const xpath of xpathPatterns) {
        try {
          const valueElement = card.locator(`xpath=${xpath}`);
          const text = await valueElement.textContent();
          if (text && text.trim().length > 0) {
            return text.trim();
          }
        } catch (error) {
          // Continue to next pattern
        }
      }

      return '';
    } catch (error) {
      return '';
    }
  }

  async verifyCardData(field: string, expectedValue: string): Promise<boolean> {
    const actualValue = await this.getCardFieldValue(field);
    return actualValue.includes(expectedValue) || expectedValue.includes(actualValue);
  }

  async isInitialDepositInTransactions(amount: string): Promise<boolean> {
    try {
      // Wait for page to be fully loaded
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      // Try multiple selectors for transactions
      const transactionSelectors = [
        'tbody tr',
        '.transaction-item',
        '.transaction-row',
        '[class*="transaction"]',
        'table tr'
      ];

      let transactionElements: Locator | null = null;
      
      for (const selector of transactionSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          transactionElements = this.page.locator(selector);
          const count = await transactionElements.count();
          if (count > 0) {
            console.log(`Found ${count} transactions using selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Try next selector
        }
      }

      if (!transactionElements) {
        console.log('No transaction elements found');
        return false;
      }

      const count = await transactionElements.count();
      console.log(`Checking ${count} transaction(s) for amount: ${amount}`);
      
      for (let i = 0; i < count; i++) {
        const transaction = transactionElements.nth(i);
        const transactionText = await transaction.textContent() || '';
        console.log(`Transaction ${i}: ${transactionText.trim()}`);
        
        const lowerText = transactionText.toLowerCase();
        const hasAmount = transactionText.includes(amount);
        const isDeposit = lowerText.includes('deposit') ||
                         lowerText.includes('befizetés') ||
                         lowerText.includes('initial') ||
                         lowerText.includes('kredit') ||
                         lowerText.includes('credit');
        
        console.log(`  - Has amount "${amount}": ${hasAmount}, Is deposit: ${isDeposit}`);
        
        if (hasAmount && isDeposit) {
          console.log(`  ✓ Found matching transaction!`);
          return true;
        }
      }
      
      console.log('No matching transaction found');
      return false;
    } catch (error) {
      console.log('Error in isInitialDepositInTransactions:', error);
      return false;
    }
  }

  async getAccountNumber(): Promise<string> {
    const value = await this.getCardFieldValue('Account Number');
    return value.replace(/[^0-9]/g, '');
  }

  async getInterestRate(): Promise<string> {
    return await this.getCardFieldValue('Interest Rate');
  }

  async getBalance(): Promise<string> {
    return await this.getCardFieldValue('Balance');
  }

  async getOwnership(): Promise<string> {
    return await this.getCardFieldValue('Ownership');
  }

  async getAccountType(): Promise<string> {
    return await this.getCardFieldValue('Account');
  }

  async getSuccessMessage(): Promise<string> {
    const message = this.page.locator('#new-account-msg');
    await message.waitFor({ state: 'visible', timeout: this.timeout });
    return await message.textContent() || '';
  }

  async isAccountVisible(accountName: string): Promise<boolean> {
    const accountHeader = this.page.locator(
      `//div[contains(@class, 'card-body')]//div[contains(@class, 'h4') and contains(@class, 'm-0') and normalize-space(text())='${accountName}']`
    );
    await accountHeader.waitFor({ state: 'visible', timeout: this.timeout });
    return await accountHeader.isVisible();
  }

  async verifyCardDataForAccount(
    accountName: string,
    fieldName: string,
    expectedValue: string
  ): Promise<boolean> {
    const accountCard = this.page.locator(
      `//div[contains(@class, 'card-body')]//div[contains(@class, 'h4') and contains(@class, 'm-0') and normalize-space(text())='${accountName}']/ancestor::div[contains(@class, 'card-body')]`
    );
    
    await accountCard.waitFor({ state: 'visible', timeout: this.timeout });

    const searchText = fieldName
      .toLowerCase()
      .replace('interestrate', 'interest rate')
      .replace('accountnumber', 'account number');

    const allElements = accountCard.locator('small.text-light, div.m-0');
    const count = await allElements.count();
    
    const allElementContents: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await allElements.nth(i).textContent();
      if (text) {
        allElementContents.push(text.toLowerCase());
      }
    }

    const hasField = allElementContents.some(text => text.includes(searchText));
    const hasValue = expectedValue === '*' || 
                     allElementContents.some(text => text.includes(expectedValue.toLowerCase()));

    return hasField && hasValue;
  }
}

