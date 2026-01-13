import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Page, BrowserContext, Browser } from '@playwright/test';

export interface CustomWorld extends World {
  page: Page;
  context: BrowserContext;
  browser: Browser;
}

export class CustomWorldImpl extends World implements CustomWorld {
  page!: Page;
  context!: BrowserContext;
  browser!: Browser;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorldImpl);

