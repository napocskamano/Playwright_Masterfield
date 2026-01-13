package hu.masterfield.digitalbank.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LoginPage extends BasePage {
    
    private static final String LOGIN_PAGE_URL = "https://eng.digitalbank.masterfield.hu/bank/login";
    
    @FindBy(css = "input[placeholder='Enter User Name'], input[name='username'], input#username")
    private WebElement usernameField;
    
    @FindBy(css = "input[placeholder='Enter Password'], input[name='password'], input#password")
    private WebElement passwordField;
    
    @FindBy(css = "button[type='submit'], .btn-primary, button.btn")
    private WebElement loginButton;
    
    @FindBy(css = ".alert-danger, .alert.alert-danger, div[role='alert']")
    private WebElement errorMessage;
    
    @FindBy(css = ".alert, div.alert")
    private WebElement alertMessage;
    
    public LoginPage(WebDriver driver) {
        super(driver);
    }


    public void isLoaded() {
        driver.get(LOGIN_PAGE_URL);
        wait.until(ExpectedConditions.visibilityOf(usernameField));
        wait.until(ExpectedConditions.visibilityOf(passwordField));
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
    }
    

    public void enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOf(usernameField));
        usernameField.clear();
        if (username != null && !username.isEmpty()) {
            usernameField.sendKeys(username);
        }
    }
    

    public void enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOf(passwordField));
        passwordField.clear();
        if (password != null && !password.isEmpty()) {
            passwordField.sendKeys(password);
        }
    }
    

    public void clickLoginButton() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
    }
    

    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLoginButton();
    }
    

    public boolean isErrorMessageDisplayed() {
        try {
            return wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOf(errorMessage),
                ExpectedConditions.visibilityOf(alertMessage)
            )) != null;
        } catch (Exception e) {
            return false;
        }
    }
    

    public String getErrorMessage() {
        try {
            if (errorMessage.isDisplayed()) {
                return errorMessage.getText();
            }
        } catch (Exception e) {

        }
        
        try {
            if (alertMessage.isDisplayed()) {
                return alertMessage.getText();
            }
        } catch (Exception e) {
            return "";
        }
        
        return "";
    }
    

    public boolean isOnLoginPage() {
        return getCurrentUrl().contains("/login");
    }
    

    public boolean isLoginButtonVisible() {
        try {
            return loginButton.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
