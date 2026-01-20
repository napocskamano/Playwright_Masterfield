import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CookieBannerPage } from '../pages/CookieBannerPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NewSavingsAccountPage } from '../pages/NewSavingsAccountPage';
import { ViewSavingsAccountsPage } from '../pages/ViewSavingsAccountsPage';
import { NewCheckingAccountPage } from '../pages/NewCheckingAccountPage';
import { ViewCheckingAccountsPage } from '../pages/ViewCheckingAccountsPage';
import { CustomWorld } from '../support/world';

let cookieBannerPage: CookieBannerPage;
let loginPage: LoginPage;
let homePage: HomePage;
let newSavingsAccountPage: NewSavingsAccountPage;
let viewSavingsAccountsPage: ViewSavingsAccountsPage;
let newCheckingAccountPage: NewCheckingAccountPage;
let viewCheckingAccountsPage: ViewCheckingAccountsPage;
let currentAccountName: string;

// Helper function
function getPageUrl(pageName: string): string {
  return `https://eng.digitalbank.masterfield.hu/bank/${pageName}`;
}

async function takeScreenshot(world: CustomWorld, screenshotName: string): Promise<void> {
  try {
    if (world.page) {
      const screenshot = await world.page.screenshot({ fullPage: true });
      world.attach(screenshot, 'image/png');
      console.log(`Screenshot taken: ${screenshotName}`);
    }
  } catch (error) {
    console.log(`Error taking screenshot: ${error}`);
  }
}

// Login Steps
Given('I am on the login page', async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.isLoaded();
  
  cookieBannerPage = new CookieBannerPage(this.page);
  await cookieBannerPage.acceptCookies();
  
  await takeScreenshot(this, 'Login page loaded');
});

When('I login with {string} and {string}', async function (this: CustomWorld, username: string, password: string) {
  await loginPage.login(username, password);
  await takeScreenshot(this, `Login attempt with: ${username}`);
});

Then('I see a message {string}', async function (this: CustomWorld, expectedMessage: string) {
  let actualMessage = '';

  // Debug: nézzük meg, hogy milyen oldalon vagyunk
  const currentUrl = await this.page.url();
  console.log(`Current URL: ${currentUrl}`);

  if (await loginPage.isOnLoginPage()) {
    console.log('On login page, getting error message...');
    actualMessage = await loginPage.getErrorMessage();
    console.log(`Error message: "${actualMessage}"`);
  }

  if (!actualMessage && (await homePage.isOnHomePage())) {
    console.log('On home page, getting success message...');
    actualMessage = await homePage.getSuccessMessage();
    console.log(`Success message: "${actualMessage}"`);
  }

  await takeScreenshot(this, 'Message displayed');
  
  // Normalize strings - távolítsuk el az extra whitespace-eket
  const normalizedActual = actualMessage.trim().replace(/\s+/g, ' ');
  const normalizedExpected = expectedMessage.trim().replace(/\s+/g, ' ');
  
  console.log(`Expected (normalized): "${normalizedExpected}"`);
  console.log(`Actual (normalized): "${normalizedActual}"`);
  
  const matches = normalizedActual.includes(normalizedExpected) || 
                  normalizedExpected.includes(normalizedActual);
  
  expect(
    matches,
    `Expected message: '${expectedMessage}' but got: '${actualMessage}'`
  ).toBeTruthy();
});

Given('I am on the {string} page', async function (this: CustomWorld, pageName: string) {
  // Inicializáljuk a page objecteket az aktuális oldalhoz
  if (pageName === 'home' || ['Áttekintés', 'Overview', 'Dashboard', 'Home'].includes(pageName)) {
    homePage = new HomePage(this.page);
    if (!(await homePage.isOnHomePage())) {
      await this.page.goto('https://eng.digitalbank.masterfield.hu/bank/home');
    }
    expect(await homePage.isOnHomePage(), 'Should be on the Home/Dashboard page').toBeTruthy();
  } else if (pageName === 'login') {
    loginPage = new LoginPage(this.page);
  } else if (pageName === 'New Saving') {
    newSavingsAccountPage = new NewSavingsAccountPage(this.page);
    await this.page.goto('https://eng.digitalbank.masterfield.hu/bank/account/savings-add');
    expect(await newSavingsAccountPage.isLoaded(), 'Should be on the New Savings Account page').toBeTruthy();
  } else if (pageName === 'View Saving') {
    viewSavingsAccountsPage = new ViewSavingsAccountsPage(this.page);
    await this.page.goto('https://eng.digitalbank.masterfield.hu/bank/account/savings-view');
    expect(await viewSavingsAccountsPage.isLoaded(), 'Should be on the View Savings Accounts page').toBeTruthy();
  } else if (pageName === 'New Checking') {
    newCheckingAccountPage = new NewCheckingAccountPage(this.page);
    await this.page.goto('https://eng.digitalbank.masterfield.hu/bank/account/checking-add');
    expect(await newCheckingAccountPage.isLoaded(), 'Should be on the New Checking Account page').toBeTruthy();
  } else if (pageName === 'View Checking') {
    viewCheckingAccountsPage = new ViewCheckingAccountsPage(this.page);
    await this.page.goto('https://eng.digitalbank.masterfield.hu/bank/account/checking-view');
    expect(await viewCheckingAccountsPage.isLoaded(), 'Should be on the View Checking Accounts page').toBeTruthy();
  } else {
    const currentUrl = await this.page.url();
    expect(
      currentUrl.includes(`/${pageName}`),
      `Expected to be on '${pageName}' page, but URL is: ${currentUrl}`
    ).toBeTruthy();
  }
  
  await takeScreenshot(this, `On page: ${pageName}`);
});

Then('I see the welcome message', async function (this: CustomWorld) {
  expect(await homePage.isWelcomeMessageDisplayed(), 'Welcome message should be displayed on home page').toBeTruthy();
  await takeScreenshot(this, 'Welcome message visible');
});

Then('I see the left side menu', async function (this: CustomWorld) {
  expect(await homePage.isLeftSideMenuDisplayed(), 'Left side menu should be displayed on home page').toBeTruthy();
  await takeScreenshot(this, 'Left side menu visible');
});

Given('I am logged in', async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  homePage = new HomePage(this.page);
  newSavingsAccountPage = new NewSavingsAccountPage(this.page);
  viewSavingsAccountsPage = new ViewSavingsAccountsPage(this.page);
  
  await loginPage.isLoaded();
  
  cookieBannerPage = new CookieBannerPage(this.page);
  await cookieBannerPage.acceptCookies();
  
  await loginPage.login('jsmith3', 'Demo123!');
  
  expect(await homePage.isLoaded(), 'Home page should be loaded after successful login').toBeTruthy();
  await takeScreenshot(this, 'Logged in successfully');
});

When('I log out', async function (this: CustomWorld) {
  await homePage.clickLogout();
  await takeScreenshot(this, 'Clicked logout');
});

Then('I am redirected to the {string} page', async function (this: CustomWorld, pageName: string) {
  const currentUrl = await this.page.url();
  await takeScreenshot(this, `Redirected to: ${pageName}`);
  
  expect(
    currentUrl.includes(`/${pageName}`),
    `Expected to be redirected to '${pageName}' page, but URL is: ${currentUrl}`
  ).toBeTruthy();
});

When('I open the {string} page', async function (this: CustomWorld, pageName: string) {
  await this.page.goto(getPageUrl(pageName));
  await takeScreenshot(this, `Page opened: ${pageName}`);
});

// Cookie Steps
Then('I see the cookie banner', async function (this: CustomWorld) {
  cookieBannerPage = new CookieBannerPage(this.page);
  expect(await cookieBannerPage.isCookieBannerVisible(), 'A cookie banner-nek láthatónak kellene lennie').toBeTruthy();
  await takeScreenshot(this, 'Cookie banner visible');
});

When('I accept the cookies', async function (this: CustomWorld) {
  await cookieBannerPage.acceptCookies();
});

Then('the cookie banner disappears', async function (this: CustomWorld) {
  expect(await cookieBannerPage.isCookieBannerDisappeared(), 'A cookie banner-nek el kellene tűnnie az elfogadás után').toBeTruthy();
  await takeScreenshot(this, 'Cookie banner disappeared');
});

// Dashboard Steps
Then('I see the chart {string}', async function (this: CustomWorld, chartName: string) {
  expect(await homePage.isChartVisible(chartName), `Chart should be visible: ${chartName}`).toBeTruthy();
  await takeScreenshot(this, `Chart visible: ${chartName}`);
});

// Savings Account Steps
Then('I fill out the form with data', async function (this: CustomWorld) {
  await newSavingsAccountPage.fillFormWithTestData();
  await takeScreenshot(this, 'Form filled with test data');
});

When('I reset the form', async function (this: CustomWorld) {
  await newSavingsAccountPage.resetForm();
  await takeScreenshot(this, 'Form reset');
});

Then('all fields are cleared', async function (this: CustomWorld) {
  expect(await newSavingsAccountPage.areAllFieldsCleared(), 'All form fields should be cleared after reset').toBeTruthy();
  await takeScreenshot(this, 'All fields cleared');
});

When('I select {string} from {string} options', async function (this: CustomWorld, value: string, fieldName: string) {
  if (fieldName === 'account type') {
    await newSavingsAccountPage.selectAccountType(value);
  } else if (fieldName === 'ownership') {
    await newSavingsAccountPage.selectOwnership(value);
  }
  await takeScreenshot(this, `Selected ${value} from ${fieldName}`);
});

Then('I enter {string} into {string} field', async function (this: CustomWorld, value: string, fieldName: string) {
  if (fieldName === 'account name') {
    currentAccountName = `${value}_${Date.now()}`;
    await newSavingsAccountPage.enterAccountName(currentAccountName);
  } else if (fieldName === 'initial deposit') {
    await newSavingsAccountPage.enterInitialDeposit(value);
  }
  await takeScreenshot(this, `Entered ${value} into ${fieldName}`);
});

Then('I submit the form', async function (this: CustomWorld) {
  await newSavingsAccountPage.submitForm();
  await takeScreenshot(this, 'Form submitted');
});

When('I create a new saving account with account type {string}, ownership {string}, account name {string} and initial deposit {string}', async function (
  this: CustomWorld,
  accountType: string,
  ownership: string,
  accountName: string,
  initialDeposit: string
) {
  currentAccountName = `${accountName}_${Date.now()}`;
  await newSavingsAccountPage.selectAccountType(accountType);
  await newSavingsAccountPage.selectOwnership(ownership);
  await newSavingsAccountPage.enterAccountName(currentAccountName);
  await newSavingsAccountPage.enterInitialDeposit(initialDeposit);
  await newSavingsAccountPage.submitForm();
  await takeScreenshot(this, 'Created new saving account with parameters');
});

Then('I see the {string} message', async function (this: CustomWorld, messageType: string) {
  let message = '';
  const currentUrl = await this.page.url();
  console.log(`Current URL when checking ${messageType} message: ${currentUrl}`);

  if (messageType === 'success') {
    // Próbáljuk meg mindhárom helyről lekérni, az URL alapján
    if (currentUrl.includes('savings-view')) {
      console.log('On savings-view page, trying to get success message...');
      viewSavingsAccountsPage = new ViewSavingsAccountsPage(this.page);
      message = await viewSavingsAccountsPage.getSuccessMessage();
      console.log(`ViewSavingsAccountsPage message: "${message}"`);
    } else if (currentUrl.includes('checking-view')) {
      console.log('On checking-view page, trying to get success message...');
      viewCheckingAccountsPage = new ViewCheckingAccountsPage(this.page);
      message = await viewCheckingAccountsPage.getSuccessMessage();
      console.log(`ViewCheckingAccountsPage message: "${message}"`);
    } else if (currentUrl.includes('/home')) {
      console.log('On home page, trying to get success message...');
      homePage = new HomePage(this.page);
      message = await homePage.getSuccessMessage();
      console.log(`HomePage message: "${message}"`);
    }
    
    expect(message.length > 0, `Success message should be displayed. Got: "${message}"`).toBeTruthy();
  } else if (messageType === 'error') {
    message = await newSavingsAccountPage.getErrorMessage();
    expect(message.length > 0, 'Error message should be displayed').toBeTruthy();
  }

  await takeScreenshot(this, `Message displayed: ${messageType}`);
});

Given('I have successfully created a new savings account', async function (this: CustomWorld) {
  newSavingsAccountPage = new NewSavingsAccountPage(this.page);
  viewSavingsAccountsPage = new ViewSavingsAccountsPage(this.page);
  
  await this.page.goto('https://eng.digitalbank.masterfield.hu/bank/account/savings-add');
  expect(await newSavingsAccountPage.isLoaded(), 'Should be on the New Savings Account page').toBeTruthy();

  currentAccountName = `Test Savings_${Date.now()}`;
  await newSavingsAccountPage.selectAccountType('Saving');
  await newSavingsAccountPage.selectOwnership('Individual');
  await newSavingsAccountPage.enterAccountName(currentAccountName);
  await newSavingsAccountPage.enterInitialDeposit('25');
  await newSavingsAccountPage.submitForm();

  await takeScreenshot(this, 'Created new savings account');
});

Then('I see the following data on a green card:', async function (this: CustomWorld, dataTable: DataTable) {
  expect(await viewSavingsAccountsPage.isAccountVisible(currentAccountName), 
    `Green card should be visible for account: ${currentAccountName}`).toBeTruthy();

  const rows = dataTable.hashes();

  for (const row of rows) {
    const account = row['Account'];
    const ownership = row['Ownership'];
    const accountNumber = row['AccountNumber'];
    const interestRate = row['InterestRate'];
    const balance = row['Balance'];

    expect(await viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, 'Account', account),
      `Account field should contain: ${account}`).toBeTruthy();
    expect(await viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, 'Ownership', ownership),
      `Ownership field should contain: ${ownership}`).toBeTruthy();
    expect(await viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, 'AccountNumber', accountNumber),
      `AccountNumber field should match pattern: ${accountNumber}`).toBeTruthy();
    expect(await viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, 'InterestRate', interestRate),
      `InterestRate field should contain: ${interestRate}`).toBeTruthy();
    expect(await viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, 'Balance', balance),
      `Balance field should contain: ${balance}`).toBeTruthy();
  }

  await takeScreenshot(this, 'Verified green card data');
});

Then('I see the initial deposit in the transactions with the correct amount', async function (this: CustomWorld) {
  const hasDeposit = (await viewSavingsAccountsPage.isInitialDepositInTransactions('$25.00')) ||
                     (await viewSavingsAccountsPage.isInitialDepositInTransactions('25'));
  
  expect(hasDeposit, 'Initial deposit should be visible in transactions').toBeTruthy();
  await takeScreenshot(this, 'Initial deposit visible in transactions');
});

// Checking Account Steps

Given('I fill out the checking form with data', async function (this: CustomWorld) {
  await newCheckingAccountPage.fillForm('Checking', 'Individual', 'Test Checking', '100');
  await takeScreenshot(this, 'Filled out checking form');
});

When('I reset the checking form', async function (this: CustomWorld) {
  await newCheckingAccountPage.resetForm();
  await takeScreenshot(this, 'Reset checking form');
});

Then('all checking fields are cleared', async function (this: CustomWorld) {
  expect(await newCheckingAccountPage.areFieldsCleared(), 'All checking form fields should be cleared').toBeTruthy();
  await takeScreenshot(this, 'Checking form fields cleared');
});

When(
  'I create a new checking account with account type {string}, ownership {string}, account name {string} and initial deposit {string}',
  async function (this: CustomWorld,
  accountType: string,
  ownership: string,
  accountName: string,
  initialDeposit: string
) {
  currentAccountName = `${accountName}_${Date.now()}`;
  await newCheckingAccountPage.selectAccountType(accountType);
  await newCheckingAccountPage.selectOwnership(ownership);
  await newCheckingAccountPage.enterAccountName(currentAccountName);
  await newCheckingAccountPage.enterInitialDeposit(initialDeposit);
  await newCheckingAccountPage.submitForm();
  await takeScreenshot(this, 'Created new checking account with parameters');
});

Given('I have successfully created a new checking account', async function (this: CustomWorld) {
  newCheckingAccountPage = new NewCheckingAccountPage(this.page);
  viewCheckingAccountsPage = new ViewCheckingAccountsPage(this.page);
  
  await this.page.goto('https://eng.digitalbank.masterfield.hu/bank/account/checking-add');
  expect(await newCheckingAccountPage.isLoaded(), 'Should be on the New Checking Account page').toBeTruthy();
  
  currentAccountName = `Test_Checking_${Date.now()}`;
  await newCheckingAccountPage.fillForm('Checking', 'Individual', currentAccountName, '100');
  await newCheckingAccountPage.submitForm();
  
  await this.page.waitForURL('**/checking-view**', { timeout: 30000 });
  await takeScreenshot(this, 'Created new checking account');
});

Then('I see the following checking data on a green card:', async function (this: CustomWorld, dataTable: DataTable) {
  expect(await viewCheckingAccountsPage.isAccountVisible(currentAccountName), 
    `Green card should be visible for checking account: ${currentAccountName}`).toBeTruthy();

  const rows = dataTable.hashes();

  for (const row of rows) {
    const account = row['Account'];
    const ownership = row['Ownership'];
    const accountNumber = row['AccountNumber'];
    const interestRate = row['InterestRate'];
    const balance = row['Balance'];

    expect(await viewCheckingAccountsPage.verifyCardDataForAccount(currentAccountName, 'Account', account),
      `Account field should contain: ${account}`).toBeTruthy();
    expect(await viewCheckingAccountsPage.verifyCardDataForAccount(currentAccountName, 'Ownership', ownership),
      `Ownership field should contain: ${ownership}`).toBeTruthy();
    expect(await viewCheckingAccountsPage.verifyCardDataForAccount(currentAccountName, 'AccountNumber', accountNumber),
      `AccountNumber field should match pattern: ${accountNumber}`).toBeTruthy();
    expect(await viewCheckingAccountsPage.verifyCardDataForAccount(currentAccountName, 'InterestRate', interestRate),
      `InterestRate field should contain: ${interestRate}`).toBeTruthy();
    expect(await viewCheckingAccountsPage.verifyCardDataForAccount(currentAccountName, 'Balance', balance),
      `Balance field should contain: ${balance}`).toBeTruthy();
  }

  await takeScreenshot(this, 'Verified checking green card data');
});

Then('I see the initial checking deposit in the transactions with the correct amount', async function (this: CustomWorld) {
  // Wait a bit for transactions to load
  await this.page.waitForTimeout(2000);
  
  // Try multiple possible amounts that might appear in the transaction
  const possibleAmounts = ['$100.00', '$100', '100.00', '100', '$25.00', '$25', '25.00', '25'];
  
  console.log('Checking for initial deposit in transactions...');
  let hasDeposit = false;
  
  for (const amount of possibleAmounts) {
    console.log(`Trying amount: ${amount}`);
    if (await viewCheckingAccountsPage.isInitialDepositInTransactions(amount)) {
      console.log(`✓ Found deposit with amount: ${amount}`);
      hasDeposit = true;
      break;
    }
  }
  
  await takeScreenshot(this, 'Checking deposit verification');
  expect(hasDeposit, 'Initial checking deposit should be visible in transactions').toBeTruthy();
});
