import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Selectors
  private readonly welcomeMessage: Locator;
  private readonly leftSideMenu: Locator;
  private readonly successMessage: Locator;
  private readonly logoutButton: Locator;
  private readonly userMenu: Locator;
  private readonly dropdownMenu: Locator;
  private readonly chartTitles: Locator;
  private readonly chartContainers: Locator;
  private readonly charts: Locator;

  constructor(page: Page) {
    super(page);
    // A welcome message a breadcrumb-ban van (#right-panel > div.breadcrumbs > ol.breadcrumb > li)
    this.welcomeMessage = page.locator('#right-panel ol.breadcrumb li').first();
    this.leftSideMenu = page.locator('aside, .sidebar, nav.sidebar').first();
    this.successMessage = page.locator('.alert-success, .alert.alert-success, div[role="alert"].alert-success').first();
    this.logoutButton = page.locator('//a[contains(text(),"Logout")]');
    this.userMenu = page.locator('img[alt="User Avatar"]');
    this.dropdownMenu = page.locator('.dropdown-menu, .user-menu');
    this.chartTitles = page.locator('//h2[@class="card-title"] | //h5[@class="card-title"] | //*[contains(@class,"card-title")]');
    this.chartContainers = page.locator('.card, .chart-container, .chart-card');
    this.charts = page.locator('canvas');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/home', { timeout: this.timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isOnHomePage(): Promise<boolean> {
    return (await this.getCurrentUrl()).includes('/home');
  }

  async isWelcomeMessageDisplayed(): Promise<boolean> {
    try {
      // Várjuk meg a breadcrumb megjelenését
      await this.welcomeMessage.waitFor({ state: 'visible', timeout: this.timeout });
      const isVisible = await this.welcomeMessage.isVisible();
      const text = await this.welcomeMessage.textContent();
      console.log(`Breadcrumb visible: ${isVisible}, text: "${text}"`);
      return isVisible;
    } catch (error) {
      console.log('Error checking breadcrumb (welcome message):', error);
      return false;
    }
  }

  async getWelcomeMessage(): Promise<string> {
    try {
      await this.welcomeMessage.waitFor({ state: 'visible', timeout: this.timeout });
      const text = await this.welcomeMessage.textContent() || '';
      console.log(`Breadcrumb text content: "${text}"`);
      return text.trim();
    } catch (error) {
      console.log('Error getting breadcrumb text:', error);
      return '';
    }
  }

  async isLeftSideMenuDisplayed(): Promise<boolean> {
    try {
      await this.leftSideMenu.waitFor({ state: 'visible', timeout: this.timeout });
      return await this.leftSideMenu.isVisible();
    } catch (error) {
      return false;
    }
  }

  async clickUserMenu(): Promise<void> {
    await this.userMenu.waitFor({ state: 'visible', timeout: this.timeout });
    await this.userMenu.click();
    
    // Wait for dropdown or logout button to appear
    try {
      await this.dropdownMenu.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  async clickLogout(): Promise<void> {
    await this.clickUserMenu();
    await this.logoutButton.waitFor({ state: 'visible', timeout: this.timeout });
    await this.logoutButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: this.timeout });
      return await this.successMessage.textContent() || '';
    } catch (error) {
      return '';
    }
  }

  async isChartVisible(chartName: string): Promise<boolean> {
    try {
      const chartElement = this.page.locator(`//*[contains(text(),"${chartName}")]`).first();
      await chartElement.waitFor({ state: 'visible', timeout: this.timeout });
      return await chartElement.isVisible();
    } catch (error) {
      console.log(`Chart not found: ${chartName}. Error: ${error}`);
      return false;
    }
  }

  async getVisibleChartsCount(): Promise<number> {
    try {
      await this.page.waitForSelector('canvas, .chart-container, [class*="chart"]', { 
        timeout: this.timeout 
      });
      
      const count = await this.charts.count();
      let visibleCount = 0;
      
      for (let i = 0; i < count; i++) {
        if (await this.charts.nth(i).isVisible()) {
          visibleCount++;
        }
      }
      
      return visibleCount;
    } catch (error) {
      return 0;
    }
  }
}

