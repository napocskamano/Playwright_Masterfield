package hu.masterfield.digitalbank.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;


public class CookieBannerPage extends BasePage {

    @FindBy(className = "cc-nb-main-container")
    private WebElement cookieBanner;
    
    @FindBy(className = "cc-nb-okagree")
    private WebElement okButton;
    
    @FindBy(className = "cc-nb-changep")
    private WebElement changeSettingsButton;
    
    @FindBy(id = "cc-nb-title")
    private WebElement cookieBannerTitle;
    
    @FindBy(id = "cc-nb-text")
    private WebElement cookieBannerMessage;
    
    public CookieBannerPage(WebDriver driver) {
        super(driver);
    }
    
   
    public boolean isCookieBannerVisible() {
        try {
            wait.until(ExpectedConditions.visibilityOf(cookieBanner));
            return cookieBanner.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
   
    public void waitForCookieBanner() {
        wait.until(ExpectedConditions.visibilityOf(cookieBanner));
    }
    
   
    public void acceptCookies() {
        try {
            if (isCookieBannerVisible()) {
                wait.until(ExpectedConditions.elementToBeClickable(okButton));
                okButton.click();
                waitForCookieBannerToDisappear();
            }
        } catch (Exception e) {
            System.out.println("Cookie banner not present or already accepted");
        }
    }
    
   
    public void changeSettings() {
        wait.until(ExpectedConditions.elementToBeClickable(changeSettingsButton));
        changeSettingsButton.click();
    }
    
   
    public boolean isCookieBannerDisappeared() {
        try {
            wait.until(ExpectedConditions.invisibilityOf(cookieBanner));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    
    public void waitForCookieBannerToDisappear() {
        wait.until(ExpectedConditions.invisibilityOf(cookieBanner));
    }
    
   
    public String getCookieBannerTitle() {
        wait.until(ExpectedConditions.visibilityOf(cookieBannerTitle));
        return cookieBannerTitle.getText();
    }
    
 
    
    public String getCookieBannerMessage() {
        wait.until(ExpectedConditions.visibilityOf(cookieBannerMessage));
        return cookieBannerMessage.getText();
    }
   
    public boolean isOkButtonVisible() {
        try {
            return okButton.isDisplayed() && okButton.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }
    

    public boolean isChangeSettingsButtonVisible() {
        try {
            return changeSettingsButton.isDisplayed() && changeSettingsButton.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }
}

