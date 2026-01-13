package hu.masterfield.digitalbank.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

public class HomePage extends BasePage {
    
    @FindBy(xpath = "//h2[contains(text(),'Welcome')] | //*[contains(@class,'welcome') or contains(text(),'Welcome')]")
    private WebElement welcomeMessage;
    
    @FindBy(css = "aside, .sidebar, nav.sidebar")
    private WebElement leftSideMenu;
    
    @FindBy(css = ".alert-success, .alert.alert-success, div[role='alert'].alert-success")
    private WebElement successMessage;
    
    @FindBy(xpath = "//a[contains(text(),'Logout')]")
    private WebElement logoutButton;
    
    @FindBy(css = "img[alt='User Avatar']")
    private WebElement userMenu;
    
    @FindBy(css = ".dropdown-menu, .user-menu")
    private WebElement dropdownMenu;
    
    @FindBy(xpath = "//h2[@class='card-title'] | //h5[@class='card-title'] | //*[contains(@class,'card-title')]")
    private List<WebElement> chartTitles;
    
    @FindBy(css = ".card, .chart-container, .chart-card")
    private List<WebElement> chartContainers;
    
    @FindBy(css = "canvas")
    private List<WebElement> charts;
    
    public HomePage(WebDriver driver) {
        super(driver);
    }
 
    
    public boolean isLoaded() {
        try {
            wait.until(ExpectedConditions.urlContains("/home"));
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    public boolean isOnHomePage() {
        return getCurrentUrl().contains("/home");
    }
  

    public boolean isWelcomeMessageDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(welcomeMessage));
            return welcomeMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }


    public String getWelcomeMessage() {
        try {
            wait.until(ExpectedConditions.visibilityOf(welcomeMessage));
            return welcomeMessage.getText();
        } catch (Exception e) {
            return "";
        }
    }
 

    public boolean isLeftSideMenuDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(leftSideMenu));
            return leftSideMenu.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }


    public void clickUserMenu() {
        wait.until(ExpectedConditions.elementToBeClickable(userMenu));
        userMenu.click();
        wait.until(ExpectedConditions.or(
            ExpectedConditions.visibilityOf(dropdownMenu),
            ExpectedConditions.elementToBeClickable(logoutButton)
        ));
    }


    public void clickLogout() {
        clickUserMenu();
        wait.until(ExpectedConditions.elementToBeClickable(logoutButton));
        logoutButton.click();
    }
    

    public String getSuccessMessage() {
        try {
            wait.until(ExpectedConditions.visibilityOf(successMessage));
            return successMessage.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public boolean isChartVisible(String chartName) {
        try {
            WebElement chartElement = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath(String.format("//*[contains(text(),'%s')]", chartName))
            ));
            return chartElement.isDisplayed();
        } catch (Exception e) {
            System.out.println("Chart not found: " + chartName + ". Error: " + e.getMessage());
            return false;
        }
    }
    
    public int getVisibleChartsCount() {
        try {
            wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("canvas, .chart-container, [class*='chart']")
            ));
            
            int count = 0;
            for (WebElement chart : charts) {
                if (chart.isDisplayed()) {
                    count++;
                }
            }
            return count;
        } catch (Exception e) {
            return 0;
        }
    }
}

