# Digital Bank Test Automation - Playwright + Cucumber + TypeScript

Átírt test automation projekt Java/Selenium/Maven-ről Playwright + Cucumber + TypeScript-re.

## 🚀 Átírás részletei

### Eredeti projekt
- **Nyelv**: Java
- **Build tool**: Maven
- **Test framework**: Selenium WebDriver
- **BDD**: Cucumber (JUnit Platform)

### Új projekt
- **Nyelv**: TypeScript
- **Build tool**: npm
- **Test framework**: Playwright
- **BDD**: Cucumber

## 📁 Projekt struktúra

```
├── src/
│   ├── features/              # Cucumber feature fájlok
│   │   ├── cookie.feature     # Cookie banner tesztek (US02)
│   │   ├── dashboard.feature  # Dashboard chart tesztek (US03)
│   │   ├── login.feature      # Login/Logout tesztek (US01, US06)
│   │   └── savings.feature    # Savings account tesztek (US04, US05)
│   ├── pages/                 # Page Object Model osztályok
│   │   ├── BasePage.ts
│   │   ├── CookieBannerPage.ts
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── NewSavingsAccountPage.ts
│   │   └── ViewSavingsAccountsPage.ts
│   ├── steps/                 # Step definitions
│   │   └── DBankSteps.ts
│   ├── support/               # Hooks és segédfájlok
│   │   ├── hooks.ts
│   │   ├── world.ts
│   │   └── report.js
│   └── utils/                 # Utility funkciók
│       └── helpers.ts
├── reports/                   # Test riportok
├── cucumber.js                # Cucumber konfiguráció
├── playwright.config.ts       # Playwright konfiguráció
├── tsconfig.json              # TypeScript konfiguráció
└── package.json               # npm konfiguráció
```

## 🔄 Átírási változások

### Page Object Model

**Java (Selenium):**
```java
@FindBy(css = "input[name='username']")
private WebElement usernameField;

public void enterUsername(String username) {
    wait.until(ExpectedConditions.visibilityOf(usernameField));
    usernameField.clear();
    usernameField.sendKeys(username);
}
```

**TypeScript (Playwright):**
```typescript
private readonly usernameField: Locator;

constructor(page: Page) {
    this.usernameField = page.locator('input[name="username"]');
}

async enterUsername(username: string): Promise<void> {
    await this.usernameField.waitFor({ state: 'visible' });
    await this.usernameField.clear();
    await this.usernameField.fill(username);
}
```

### Step Definitions

**Java (Selenium):**
```java
@Given("I am on the login page")
public void iAmOnTheLoginPage() {
    loginPage.isLoaded();
    cookieBannerPage.acceptCookies();
}
```

**TypeScript (Playwright):**
```typescript
@Given('I am on the login page')
async function iAmOnTheLoginPage(this: CustomWorld) {
    loginPage = new LoginPage(this.page);
    await loginPage.isLoaded();
    
    cookieBannerPage = new CookieBannerPage(this.page);
    await cookieBannerPage.acceptCookies();
}
```

### Hooks (Browser setup)

**Java (Selenium):**
```java
@Before
public void setup(Scenario scenario) {
    WebDriverManager.chromedriver().setup();
    ChromeOptions options = new ChromeOptions();
    driver = new ChromeDriver(options);
    driver.manage().window().maximize();
}
```

**TypeScript (Playwright):**
```typescript
Before(async function () {
    browser = await chromium.launch({
        headless: true,
        slowMo: 0
    });
    
    context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    page = await context.newPage();
    this.page = page;
});
```

## 🔧 Telepítés

### 1. Dependenciák telepítése

```bash
npm install
```

### 2. Playwright böngészők telepítése

```bash
npx playwright install
```

### 3. Környezeti változók (opcionális)

Másold le a `.env.example` fájlt `.env` névre:

```bash
cp .env.example .env
```

## 🎯 Tesztek futtatása

```bash
# Összes teszt futtatása
npm test

# Párhuzamos futtatás
npm run test:parallel

# Csak login tesztek
npm run test:login

# Csak cookie tesztek
npm run test:cookie

# Csak dashboard tesztek
npm run test:dashboard

# Csak savings tesztek
npm run test:savings

# Egyedi tag alapján
npm run test:tag @smoke
```

## 📊 Test Scenarios (User Stories)

### US01 - Login/Logout
- ✅ Sikertelen login hibás adatokkal
- ✅ Sikeres login helyes adatokkal
- ✅ Üdvözlő üzenet megjelenítése
- ✅ Oldalsó menü megjelenítése

### US02 - Cookie Banner
- ✅ Cookie banner megjelenítése
- ✅ Cookie-k elfogadása
- ✅ Cookie banner eltűnése

### US03 - Financial Dashboard
- ✅ Grafikonok megjelenítése
- ✅ Account Balance Summary
- ✅ Deposit vs. Withdraw grafikon

### US04 - Savings Account Creation
- ✅ Űrlap reset funkció
- ✅ Sikeres megtakarítási számla létrehozása

### US05 - Account Data Display
- ✅ Új számla adatainak megjelenítése
- ✅ Kezdeti befizetés tranzakcióban
- ✅ Zöld kártya ellenőrzése

### US06 - Logout
- ✅ Kijelentkezés
- ✅ Átirányítás login oldalra

## 🎭 Playwright előnyei Seleniummal szemben

1. **Auto-waiting**: Playwright automatikusan vár az elemekre
2. **Gyorsabb**: Natív browser protocol használat
3. **Megbízhatóbb**: Kevesebb flaky test
4. **Modern API**: Async/await, tisztább szintaxis
5. **Beépített screenshot/video**: Könnyebb debugging
6. **Network interception**: API mock-olás lehetősége
7. **Multi-browser**: Chromium, Firefox, WebKit támogatás
8. **Headless by default**: Gyorsabb CI/CD

## 📈 Test Report

Riportok generálása:

```bash
npm run report
```

A riportok a következő helyeken találhatók:
- HTML: `reports/cucumber-report.html`
- JSON: `reports/cucumber-report.json`
- JUnit XML: `reports/cucumber-report.xml`
- Screenshots: `reports/screenshots/`
- Videos: `reports/videos/`

## 🐛 Hibakeresés

### Headless mód kikapcsolása

Módosítsd a `src/support/hooks.ts` fájlban:

```typescript
browser = await chromium.launch({
  headless: false,  // Böngésző látható
  slowMo: 1000,     // Lassított lejátszás
});
```

### TypeScript típus ellenőrzés

```bash
npm run pretest
```

## 🔗 Hasznos linkek

- [Playwright dokumentáció](https://playwright.dev/)
- [Cucumber.js dokumentáció](https://cucumber.io/docs/cucumber/)
- [TypeScript dokumentáció](https://www.typescriptlang.org/)
- [Digital Bank alkalmazás](https://eng.digitalbank.masterfield.hu/)

## 📝 Teszt felhasználó

```
Username: jsmith3
Password: Demo123!
```

## ✨ Főbb különbségek

| Tulajdonság | Java/Selenium | TypeScript/Playwright |
|-------------|---------------|----------------------|
| Szintaxis | Verbose, több kód | Tömör, modern |
| Várakozás | Explicit wait szükséges | Auto-waiting beépített |
| Async kezelés | Nincs (szinkron) | Async/await |
| Browser driver | WebDriverManager | Beépített |
| Timeout | Manuális kezelés | Automatikus retry |
| Screenshot | Manuális implementáció | Beépített API |
| Network mock | Külső library | Natív támogatás |

## 🎓 Következő lépések

1. Futtasd a teszteket: `npm test`
2. Nézd meg a riportokat: `npm run report`
3. Írd át a többi teszteket ugyanígy
4. Integráld CI/CD pipeline-ba
5. Adj hozzá további teszteket

## 📄 Licenc

MIT License

---

**Készült**: 2026-01-12  
**Átírva**: Java/Selenium/Maven ➜ TypeScript/Playwright/npm

