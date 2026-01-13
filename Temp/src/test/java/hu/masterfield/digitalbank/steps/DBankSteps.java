package hu.masterfield.digitalbank.steps;

import hu.masterfield.digitalbank.pages.CookieBannerPage;
import hu.masterfield.digitalbank.pages.HomePage;
import hu.masterfield.digitalbank.pages.LoginPage;
import hu.masterfield.digitalbank.pages.NewSavingsAccountPage;
import hu.masterfield.digitalbank.pages.ViewSavingsAccountsPage;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.time.Duration;

public class DBankSteps {
    protected static WebDriver driver = null;
    protected static WebDriverWait wait = null;
    protected static CookieBannerPage cookieBannerPage = null;
    protected static LoginPage loginPage = null;
    protected static HomePage homePage = null;
    protected static NewSavingsAccountPage newSavingsAccountPage = null;
    protected static ViewSavingsAccountsPage viewSavingsAccountsPage = null;
    private static Scenario scenario = null;
    private static String currentAccountName = null;

    @Before
    public void setup(Scenario scenario) throws IOException {
        DBankSteps.scenario = scenario;
        
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();

        options.addArguments("--lang=en-US");

        options.addArguments("--incognito");

        options.addArguments("--disable-blink-features=AutomationControlled");

        options.addArguments("--disable-infobars");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.manage().window().maximize();

        cookieBannerPage = new CookieBannerPage(driver);
        loginPage = new LoginPage(driver);
        homePage = new HomePage(driver);
        newSavingsAccountPage = new NewSavingsAccountPage(driver);
        viewSavingsAccountsPage = new ViewSavingsAccountsPage(driver);
    }

    protected String getPageUrl(String pageName) {
        return "https://eng.digitalbank.masterfield.hu/bank/" + pageName;
    }

    @After
    public void cleanup(Scenario scenario) {
        if (scenario.isFailed()) {
            takeScreenshot("FAILED");
        }
        if (driver != null) {
            driver.quit();
        }
    }

  
    private void takeScreenshot(String screenshotName) {
        try {
            if (driver != null) {
                byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                scenario.attach(screenshot, "image/png", screenshotName);
            }
        } catch (Exception e) {
            System.out.println("Error taking screenshot: " + e.getMessage());
        }
    }


    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        loginPage.isLoaded();
        cookieBannerPage.acceptCookies();
        takeScreenshot("Login page loaded");
    }

    @When("I login with {string} and {string}")
    public void iLoginWithAnd(String username, String password) {
        loginPage.login(username, password);
        takeScreenshot("Login attempt with: " + username);
    }

    @Then("I see a message {string}")
    public void iSeeAMessage(String expectedMessage) {
        String actualMessage = "";
        
        if (loginPage.isOnLoginPage()) {
            actualMessage = loginPage.getErrorMessage();
        }
        
        if (actualMessage.isEmpty() && homePage.isOnHomePage()) {
            actualMessage = homePage.getSuccessMessage();
        }
        
        takeScreenshot("Message displayed");
        assertTrue(actualMessage.contains(expectedMessage) || expectedMessage.contains(actualMessage),
                "Expected message: '" + expectedMessage + "' but got: '" + actualMessage + "'");
    }

    @Given("I am on the {string} page")
    public void iAmOnThePage(String pageName) {
        if (pageName.equals("Áttekintés") || pageName.equals("Overview") || pageName.equals("Dashboard") || pageName.equals("Home")) {
            if (!homePage.isOnHomePage()) {
                driver.get("https://eng.digitalbank.masterfield.hu/bank/home");
            }
            assertTrue(homePage.isOnHomePage(), 
                    "Should be on the Home/Dashboard page");
        } else if (pageName.equals("New Saving")) {
            driver.get("https://eng.digitalbank.masterfield.hu/bank/account/savings-add");
            assertTrue(newSavingsAccountPage.isLoaded(), 
                    "Should be on the New Savings Account page");
        } else if (pageName.equals("View Saving")) {
            driver.get("https://eng.digitalbank.masterfield.hu/bank/account/savings-view");
            assertTrue(viewSavingsAccountsPage.isLoaded(), 
                    "Should be on the View Savings Accounts page");
        } else {
            String currentUrl = driver.getCurrentUrl();
            assertTrue(currentUrl.contains("/" + pageName),
                    "Expected to be on '" + pageName + "' page, but URL is: " + currentUrl);
        }
        takeScreenshot("On page: " + pageName);
    }

    @And("I see the welcome message")
    public void iSeeTheWelcomeMessage() {
        assertTrue(homePage.isWelcomeMessageDisplayed(), 
                "Welcome message should be displayed on home page");
        takeScreenshot("Welcome message visible");
    }

    @And("I see the left side menu")
    public void iSeeTheLeftSideMenu() {
        assertTrue(homePage.isLeftSideMenuDisplayed(), 
                "Left side menu should be displayed on home page");
        takeScreenshot("Left side menu visible");
    }

    @Given("I am logged in")
    public void iAmLoggedIn() {
        iAmOnTheLoginPage();
        
        loginPage.login("jsmith3", "Demo123!");
        
        assertTrue(homePage.isLoaded(), "Home page should be loaded after successful login");
        takeScreenshot("Logged in successfully");
    }

    @When("I log out")
    public void iLogOut() {
        homePage.clickLogout();
        takeScreenshot("Clicked logout");
    }

    @Then("I am redirected to the {string} page")
    public void iAmRedirectedToThePage(String pageName) {
        String currentUrl = driver.getCurrentUrl();
        takeScreenshot("Redirected to: " + pageName);
        
        assertTrue(currentUrl.contains("/" + pageName),
                "Expected to be redirected to '" + pageName + "' page, but URL is: " + currentUrl);
    }

    @When("I open the {string} page")
    public void IOpenThePage(String pageName) {
        driver.get(getPageUrl(pageName));
        takeScreenshot("Page opened: " + pageName);
    }
    
    @Then("I see the cookie banner")
    public void iSeeTheCookieBanner() {
        assertTrue(cookieBannerPage.isCookieBannerVisible(), 
                "A cookie banner-nek láthatónak kellene lennie");
        takeScreenshot("Cookie banner visible");
    }
        
    @When("I accept the cookies")
    public void iAcceptTheCookies() {
        cookieBannerPage.acceptCookies();
    }
     
    @Then("the cookie banner disappears")
    public void theCookieBannerDisappears() {
        assertTrue(cookieBannerPage.isCookieBannerDisappeared(), 
                "A cookie banner-nek el kellene tűnnie az elfogadás után");
        takeScreenshot("Cookie banner disappeared");
    }
    
    @Then("I see the chart {string}")
    public void iSeeTheChart(String chartName) {
        assertTrue(homePage.isChartVisible(chartName), 
                "Chart should be visible: " + chartName);
        takeScreenshot("Chart visible: " + chartName);
    }
    
    @And("I fill out the form with data")
    public void iFillOutTheFormWithData() {
        newSavingsAccountPage.fillFormWithTestData();
        takeScreenshot("Form filled with test data");
    }
    
    @When("I reset the form")
    public void iResetTheForm() {
        newSavingsAccountPage.resetForm();
        takeScreenshot("Form reset");
    }
    
    @Then("all fields are cleared")
    public void allFieldsAreCleared() {
        assertTrue(newSavingsAccountPage.areAllFieldsCleared(), 
                "All form fields should be cleared after reset");
        takeScreenshot("All fields cleared");
    }
    
    @When("I select {string} from {string} options")
    public void iSelectFromOptions(String value, String fieldName) {
        if (fieldName.equals("account type")) {
            newSavingsAccountPage.selectAccountType(value);
        } else if (fieldName.equals("ownership")) {
            newSavingsAccountPage.selectOwnership(value);
        }
        takeScreenshot("Selected " + value + " from " + fieldName);
    }
    
    @And("I enter {string} into {string} field")
    public void iEnterIntoField(String value, String fieldName) {
        if (fieldName.equals("account name")) {
            currentAccountName = value + "_" + System.currentTimeMillis();
            newSavingsAccountPage.enterAccountName(currentAccountName);
        } else if (fieldName.equals("initial deposit")) {
            newSavingsAccountPage.enterInitialDeposit(value);
        }
        takeScreenshot("Entered " + value + " into " + fieldName);
    }
    
    @And("I submit the form")
    public void iSubmitTheForm() {
        newSavingsAccountPage.submitForm();
        takeScreenshot("Form submitted");
    }
    
    @When("I create a new saving account with account type {string}, ownership {string}, account name {string} and initial deposit {string}")
    public void iCreateANewSavingAccountWithAccountTypeOwnershipAccountNameAndInitialDeposit(
            String accountType, String ownership, String accountName, String initialDeposit) {
        currentAccountName = accountName + "_" + System.currentTimeMillis();
        newSavingsAccountPage.selectAccountType(accountType);
        newSavingsAccountPage.selectOwnership(ownership);
        newSavingsAccountPage.enterAccountName(currentAccountName);
        newSavingsAccountPage.enterInitialDeposit(initialDeposit);
        newSavingsAccountPage.submitForm();
        takeScreenshot("Created new saving account with parameters");
    }
    
    @Then("I see the {string} message")
    public void iSeeTheMessage(String messageType) {
        String message = "";
        
        if (messageType.equals("success")) {
            if (viewSavingsAccountsPage.isLoaded()) {
                message = viewSavingsAccountsPage.getSuccessMessage();
            }
            if (message.isEmpty() && homePage.isOnHomePage()) {
                message = homePage.getSuccessMessage();
            }
            assertTrue(!message.isEmpty(), 
                    "Success message should be displayed");
        } else if (messageType.equals("error")) {
            message = newSavingsAccountPage.getErrorMessage();
            assertTrue(!message.isEmpty(), 
                    "Error message should be displayed");
        }
        
        takeScreenshot("Message displayed: " + messageType);
    }
    
    @Given("I have successfully created a new savings account")
    public void iHaveSuccessfullyCreatedANewSavingsAccount() {
        driver.get("https://eng.digitalbank.masterfield.hu/bank/account/savings-add");
        assertTrue(newSavingsAccountPage.isLoaded(), 
                "Should be on the New Savings Account page");
        
        currentAccountName = "Test Savings_" + System.currentTimeMillis();
        newSavingsAccountPage.selectAccountType("Saving");
        newSavingsAccountPage.selectOwnership("Individual");
        newSavingsAccountPage.enterAccountName(currentAccountName);
        newSavingsAccountPage.enterInitialDeposit("25");
        newSavingsAccountPage.submitForm();
        
        takeScreenshot("Created new savings account");
    }
    
    @Then("I see the following data on a green card:")
    public void iSeeTheFollowingDataOnAGreenCard(DataTable dataTable) {
        assertTrue(viewSavingsAccountsPage.isAccountVisible(currentAccountName), 
                "Green card should be visible for account: " + currentAccountName);
        
        var rows = dataTable.asMaps(String.class, String.class);
        
        for (var row : rows) {
            String account = row.get("Account");
            String ownership = row.get("Ownership");
            String accountNumber = row.get("AccountNumber");
            String interestRate = row.get("InterestRate");
            String balance = row.get("Balance");
            
            assertTrue(viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, "Account", account),
                    "Account field should contain: " + account);
            assertTrue(viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, "Ownership", ownership),
                    "Ownership field should contain: " + ownership);
            assertTrue(viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, "AccountNumber", accountNumber),
                    "AccountNumber field should match pattern: " + accountNumber);
            assertTrue(viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, "InterestRate", interestRate),
                    "InterestRate field should contain: " + interestRate);
            assertTrue(viewSavingsAccountsPage.verifyCardDataForAccount(currentAccountName, "Balance", balance),
                    "Balance field should contain: " + balance);
        }
        
        takeScreenshot("Verified green card data");
    }
    
    @Then("I see the initial deposit in the transactions with the correct amount")
    public void iSeeTheInitialDepositInTheTransactionsWithTheCorrectAmount() {
        assertTrue(viewSavingsAccountsPage.isInitialDepositInTransactions("$25.00") || 
                   viewSavingsAccountsPage.isInitialDepositInTransactions("25"),
                "Initial deposit should be visible in transactions");
        takeScreenshot("Initial deposit visible in transactions");
    }
}
