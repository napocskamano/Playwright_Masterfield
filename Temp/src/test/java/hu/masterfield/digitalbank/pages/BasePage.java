package hu.masterfield.digitalbank.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;


public class BasePage {
    
    protected final WebDriver driver;
    protected final WebDriverWait wait;
    
 
    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
    
 
    public String getPageTitle() {
        return driver.getTitle();
    }
    

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
    

    public void refreshPage() {
        driver.navigate().refresh();
    }
    
   
    public void goBack() {
        driver.navigate().back();
    }
    
  
    public void goForward() {
        driver.navigate().forward();
    }
}

