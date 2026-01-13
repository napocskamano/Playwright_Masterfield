# Gyors Referencia - Digital Bank Playwright Tesztek

## 🚀 Gyors Start

```bash
# 1. Telepítés
npm install
npx playwright install

# 2. Tesztek futtatása
npm test

# 3. Riport megtekintése
npm run report
start reports/cucumber-report.html
```

## 📝 NPM Parancsok

| Parancs | Leírás |
|---------|--------|
| `npm install` | Függőségek telepítése |
| `npm test` | Összes teszt futtatása |
| `npm run test:parallel` | Párhuzamos futtatás |
| `npm run test:login` | Csak login tesztek |
| `npm run test:cookie` | Csak cookie tesztek |
| `npm run test:dashboard` | Csak dashboard tesztek |
| `npm run test:savings` | Csak savings tesztek |
| `npm run test:tag @smoke` | Tag alapú futtatás |
| `npm run report` | HTML riport generálása |
| `npm run pretest` | TypeScript típusellenőrzés |

## 🏷️ Tag Használat

```bash
# Egyedi tag
npm run test:tag @login

# Több tag (OR logika)
npm run test:tag "@login or @cookie"

# Tagek kombinálása (AND logika)
npm run test:tag "@login and @smoke"

# Tag kizárása
npm run test:tag "not @wip"
```

## 📂 Projekt Struktúra

```
src/
├── features/                    # Gherkin feature fájlok
│   ├── cookie.feature          # @cookie
│   ├── dashboard.feature       # @dashboard
│   ├── login.feature           # @login
│   └── savings.feature         # @savings
│
├── pages/                       # Page Object Model
│   ├── BasePage.ts             # Alap osztály
│   ├── CookieBannerPage.ts     # Cookie banner
│   ├── HomePage.ts             # Dashboard/Home
│   ├── LoginPage.ts            # Login oldal
│   ├── NewSavingsAccountPage.ts # Új számla
│   └── ViewSavingsAccountsPage.ts # Számlák listája
│
├── steps/                       # Step definitions
│   └── DBankSteps.ts           # Összes step
│
├── support/                     # Támogató fájlok
│   ├── hooks.ts                # Before/After hooks
│   ├── world.ts                # Custom World
│   └── report.js               # Riport generáló
│
└── utils/                       # Segédfüggvények
    └── helpers.ts              # Utility funkciók
```

## 🧪 User Stories és Tesztek

### US01 - Login/Logout (@login)
```gherkin
✅ Unsuccessful login with incorrect password
✅ Successful login with valid credentials
✅ Logout from menu
```

### US02 - Cookie Banner (@cookie)
```gherkin
✅ Accept cookie banner
```

### US03 - Dashboard (@dashboard)
```gherkin
✅ Verify charts on Dashboard page
```

### US04 - Savings Creation (@savings)
```gherkin
✅ Reset form to default state
✅ Successful account opening with valid data
```

### US05 - Account Display (@savings)
```gherkin
✅ Verify new account data in the list
✅ Initial deposit appears in transactions
```

## 🔑 Test Credentials

```
URL: https://eng.digitalbank.masterfield.hu/bank/login
Username: jsmith3
Password: Demo123!
```

## 📊 Riportok Helye

```
reports/
├── cucumber-report.html        # HTML riport ⭐
├── cucumber-report.json        # JSON riport
├── cucumber-report.xml         # JUnit XML
├── screenshots/                # Screenshot-ok (failed tesztek)
└── videos/                     # Videók (failed tesztek)
```

## 🐛 Debug Mód

### Headed Mode (böngésző látható)

`src/support/hooks.ts` módosítása:
```typescript
browser = await chromium.launch({
  headless: false,  // ← false
  slowMo: 1000,     // ← lassítás ms-ben
});
```

### Playwright Inspector

```bash
PWDEBUG=1 npm test
```

### Console Log

```typescript
console.log('Debug info:', value);
```

## 🔧 Konfiguráció Fájlok

| Fájl | Cél |
|------|-----|
| `package.json` | npm függőségek és scriptek |
| `tsconfig.json` | TypeScript konfiguráció |
| `cucumber.js` | Cucumber beállítások |
| `playwright.config.ts` | Playwright konfiguráció |
| `.env` | Környezeti változók (opcionális) |

## 📝 Új Teszt Hozzáadása

### 1. Feature fájl létrehozása

```gherkin
# src/features/my-feature.feature
@my-tag
Feature: My Feature
  Scenario: My Test
    Given I am logged in
    When I do something
    Then I see the result
```

### 2. Page Object létrehozása

```typescript
// src/pages/MyPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator('#my-element');
  }

  async doSomething(): Promise<void> {
    await this.myElement.click();
  }
}
```

### 3. Step Definition hozzáadása

```typescript
// src/steps/DBankSteps.ts
@When('I do something')
async function iDoSomething(this: CustomWorld) {
  const myPage = new MyPage(this.page);
  await myPage.doSomething();
}
```

### 4. Teszt futtatása

```bash
npm run test:tag @my-tag
```

## 🎯 Best Practices

### ✅ DO

```typescript
// Használj async/await
await page.click('button');

// Használj Playwright auto-waiting-et
await element.click();  // Automatikusan vár

// Használj explicit selectorokat
page.locator('#login-button')

// Használj Page Object Model-t
const loginPage = new LoginPage(page);
await loginPage.login(username, password);

// Használj meaningful neveket
async function iSeeTheWelcomeMessage() { ... }
```

### ❌ DON'T

```typescript
// Ne használj explicit sleep-et
await page.waitForTimeout(5000);  // ❌

// Ne használj xpath-ot, ha CSS elegendő
page.locator('//div[@class="button"]')  // ❌
page.locator('div.button')  // ✅

// Ne duplázd a kódot
// Használj Page Object-eket és helper function-öket

// Ne felejts el await-et
page.click('button');  // ❌ Promise-t ad vissza
await page.click('button');  // ✅
```

## 🔍 Gyakori Selectorok

```typescript
// ID
page.locator('#element-id')

// Class
page.locator('.class-name')

// Attribútum
page.locator('[name="username"]')

// Text tartalom
page.locator('text=Login')

// XPath
page.locator('//button[contains(text(), "Submit")]')

// Első/utolsó elem
page.locator('button').first()
page.locator('button').last()

// N-edik elem
page.locator('button').nth(2)

// Parent -> Child
page.locator('div.parent >> button')
```

## 📈 Performance Tips

1. **Párhuzamos futtatás**: `npm run test:parallel`
2. **Headless mód**: Gyorsabb (alapértelmezett)
3. **Network idle**: Ne várj rá, ha nem szükséges
4. **Screenshot/Video**: Csak failed teszteknél
5. **Minimal timeout**: Ne használj túl nagy timeout-okat

## 🚦 CI/CD Integráció

### GitHub Actions

```yaml
- name: Run tests
  run: npm test

- name: Upload results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: reports/
```

### Jenkins

```groovy
stage('Test') {
  steps {
    sh 'npm install'
    sh 'npx playwright install --with-deps'
    sh 'npm test'
  }
}
```

## 🆘 Gyors Problémamegoldás

| Probléma | Megoldás |
|----------|----------|
| Module not found | `npm install` |
| Browser not found | `npx playwright install` |
| TypeScript hiba | `npm run pretest` |
| Timeout | Növeld a timeout-ot `src/pages/BasePage.ts`-ben |
| Lassú teszt | Használj `headless: true` |
| Element not found | Ellenőrizd a selectort, adj hozzá wait-et |

## 📚 Dokumentációk

- **Projekt**: [README_DIGITALBANK.md](./README_DIGITALBANK.md)
- **Telepítés**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Átírás**: [MIGRATION_NOTES.md](./MIGRATION_NOTES.md)
- **Playwright**: https://playwright.dev/
- **Cucumber**: https://cucumber.io/docs/cucumber/

## 💡 Hasznos Tippek

### Screenshot készítése

```typescript
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

### Várakozás elemre

```typescript
await page.waitForSelector('#element');
await page.waitForURL('**/home');
await page.waitForLoadState('networkidle');
```

### Network log

```typescript
page.on('request', request => console.log('>>', request.method(), request.url()));
page.on('response', response => console.log('<<', response.status(), response.url()));
```

### Console output capture

```typescript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

---

**Verzió**: 1.0.0  
**Utolsó frissítés**: 2026-01-12

