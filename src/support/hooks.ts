import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, BrowserContext } from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import * as fs from 'fs';
import * as path from 'path';

// Cucumber timeout beállítása - 60 másodperc
setDefaultTimeout(60 * 1000);

let browser: Browser;
let context: BrowserContext;
let page: Page;

// Create necessary directories
function ensureDirectoriesExist() {
  const directories = [
    './reports',
    './reports/screenshots',
    './reports/videos'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

BeforeAll(async function () {
  console.log('========================================');
  console.log('Digital Bank Test Suite Started');
  console.log('========================================');
  ensureDirectoriesExist();
});

Before(async function () {
  browser = await chromium.launch({
    headless: false,  // Böngésző látható lesz
    slowMo: 100,      // 100ms lassítás a lépések között (jobban látható)
    args: [
      '--start-maximized',  // Böngésző maximalizálása indításkor
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars'
    ]
  });
  
  context = await browser.newContext({
    viewport: null,  // null = használja a böngésző ablak teljes méretét (maximalizált)
    locale: 'en-US',
    recordVideo: {
      dir: './reports/videos/',
      size: { width: 1920, height: 1080 }  // videó rögzítés mérete
    }
  });
  
  page = await context.newPage();
  
  // Make page available to step definitions
  this.page = page;
  this.context = context;
  this.browser = browser;
});

After(async function (scenario: ITestCaseHookParameter) {
  const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
  
  if (scenario.result?.status === Status.FAILED) {
    // Take screenshot on failure
    try {
      const screenshot = await page.screenshot({ 
        path: `./reports/screenshots/FAILED_${scenarioName}_${Date.now()}.png`,
        fullPage: true 
      });
      this.attach(screenshot, 'image/png');
      console.log(`Screenshot captured for failed scenario: ${scenario.pickle.name}`);
    } catch (error) {
      console.log(`Error taking screenshot: ${error}`);
    }
  }
  
  // Close page and context
  if (page) {
    await page.close();
  }
  if (context) {
    await context.close();
  }
  if (browser) {
    await browser.close();
  }
});

AfterAll(async function () {
  console.log('========================================');
  console.log('Digital Bank Test Suite Finished');
  console.log('========================================');
});

export { browser, context, page };

