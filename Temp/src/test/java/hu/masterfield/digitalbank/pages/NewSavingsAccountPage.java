package hu.masterfield.digitalbank.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class NewSavingsAccountPage extends BasePage {
    
    private WebElement accountNameField;
    private WebElement initialDepositField;
    private WebElement submitButton;
    private WebElement resetButton;
    
    public NewSavingsAccountPage(WebDriver driver) {
        super(driver);
    }
    
    public boolean isLoaded() {
        try {
            wait.until(ExpectedConditions.urlContains("savings-add"));
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='radio']")));
            initElements();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private void initElements() {
        accountNameField = driver.findElement(By.cssSelector("input[type='text'][id*='account' i], input[id*='name' i]"));
        initialDepositField = driver.findElement(By.cssSelector("#openingBalance"));
        submitButton = driver.findElement(By.cssSelector("#newSavingsSubmit"));
        resetButton = driver.findElement(By.cssSelector("button[type='reset']"));
    }
    
    public void selectAccountType(String accountType) {
        WebElement radio = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input[type='radio'][id*='" + accountType + "' i]")
        ));
        if (!radio.isSelected()) {
            radio.click();
        }
    }
    
    public void selectOwnership(String ownership) {
        WebElement radio = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input[type='radio'][id*='" + ownership + "' i]")
        ));
        if (!radio.isSelected()) {
            radio.click();
        }
    }
    
    public void enterAccountName(String accountName) {
        wait.until(ExpectedConditions.visibilityOf(accountNameField));
        accountNameField.clear();
        accountNameField.sendKeys(accountName);
    }
    
    public void enterInitialDeposit(String amount) {
        wait.until(ExpectedConditions.visibilityOf(initialDepositField));
        initialDepositField.clear();
        initialDepositField.sendKeys(amount);
    }
    
    public void submitForm() {
        wait.until(ExpectedConditions.elementToBeClickable(submitButton));
        submitButton.click();
    }
    
    public void resetForm() {
        wait.until(ExpectedConditions.elementToBeClickable(resetButton));
        resetButton.click();
    }
    
    public boolean areAllFieldsCleared() {
        wait.until(ExpectedConditions.visibilityOf(accountNameField));
        
        String accountName = accountNameField.getAttribute("value");
        String initialDeposit = initialDepositField.getAttribute("value");
        
        boolean accountNameEmpty = accountName == null || accountName.isEmpty();
        boolean depositEmpty = initialDeposit == null || initialDeposit.isEmpty();
        
        return accountNameEmpty && depositEmpty;
    }
    
    public void fillFormWithTestData() {
        selectAccountType("Saving");
        selectOwnership("Individual");
        enterAccountName("Test Account");
        enterInitialDeposit("100");
    }
    
    public String getSuccessMessage() {
        WebElement message = wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("#new-account-msg")
        ));
        return message.getText();
    }
    
    public String getErrorMessage() {
        WebElement message = wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector(".alert-danger, .alert.alert-danger, div[role='alert'].alert-danger")
        ));
        return message.getText();
    }
}