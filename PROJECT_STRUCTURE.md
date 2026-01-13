# 📁 Projekt Struktúra - Digital Bank Playwright

## 🌳 Teljes Projekt Fa

```
Playwright_Masterfield/
│
├── 📂 src/                                    # Forráskód
│   │
│   ├── 📂 features/                           # Cucumber feature fájlok (Gherkin)
│   │   ├── 📄 cookie.feature                 # Cookie banner tesztek (@cookie)
│   │   ├── 📄 dashboard.feature              # Dashboard tesztek (@dashboard)
│   │   ├── 📄 login.feature                  # Login/Logout tesztek (@login)
│   │   └── 📄 savings.feature                # Savings tesztek (@savings)
│   │
│   ├── 📂 pages/                              # Page Object Model (POM)
│   │   ├── 📄 BasePage.ts                    # ⭐ Alap osztály (minden page ebből származik)
│   │   ├── 📄 CookieBannerPage.ts            # Cookie banner interakciók
│   │   ├── 📄 HomePage.ts                    # Dashboard/Home oldal
│   │   ├── 📄 LoginPage.ts                   # Login oldal
│   │   ├── 📄 NewSavingsAccountPage.ts       # Új megtakarítási számla létrehozása
│   │   └── 📄 ViewSavingsAccountsPage.ts     # Számlák listázása és adatok
│   │
│   ├── 📂 steps/                              # Cucumber step definitions
│   │   └── 📄 DBankSteps.ts                  # ⭐ Összes step implementation (~400 sor)
│   │
│   ├── 📂 support/                            # Segéd fájlok
│   │   ├── 📄 hooks.ts                       # Before/After hooks, browser setup
│   │   ├── 📄 world.ts                       # Custom World definition (context)
│   │   └── 📄 report.js                      # HTML riport generátor
│   │
│   └── 📂 utils/                              # Utility funkciók
│       └── 📄 helpers.ts                     # Segédfüggvények (wait, random, etc.)
│
├── 📂 reports/                                # Generált riportok (gitignore)
│   ├── 📄 cucumber-report.html               # HTML riport ⭐
│   ├── 📄 cucumber-report.json               # JSON riport
│   ├── 📄 cucumber-report.xml                # JUnit XML
│   ├── 📂 screenshots/                        # Screenshot-ok (failed)
│   └── 📂 videos/                             # Videók (failed)
│
├── 📂 Temp/                                   # Eredeti Java/Selenium projekt (referencia)
│   ├── 📂 src/test/
│   │   ├── 📂 java/hu/masterfield/digitalbank/
│   │   └── 📂 resources/features/
│   └── 📄 pom.xml
│
├── 📂 node_modules/                           # npm dependenciák (gitignore)
│
├── ⚙️ cucumber.js                             # ⭐ Cucumber konfiguráció
├── ⚙️ playwright.config.ts                    # ⭐ Playwright konfiguráció
├── ⚙️ tsconfig.json                           # ⭐ TypeScript konfiguráció
├── ⚙️ package.json                            # ⭐ npm projekt konfiguráció
│
├── 🔒 .gitignore                              # Git ignore rules
├── 📄 .env.example                            # Környezeti változók példa
│
├── 📚 README.md                               # Eredeti README
├── 📚 README_DIGITALBANK.md                   # ⭐ Főbb projekt dokumentáció
├── 📚 SETUP_GUIDE.md                          # ⭐ Telepítési útmutató
├── 📚 MIGRATION_NOTES.md                      # ⭐ Átírási jegyzetek
├── 📚 QUICK_REFERENCE.md                      # ⭐ Gyors referencia
├── 📚 CONVERSION_SUMMARY.md                   # ⭐ Átírás összefoglaló
└── 📚 PROJECT_STRUCTURE.md                    # ⭐ Ez a fájl
```

---

## 📦 Fájlok Részletesen

### 🎯 Feature Files (src/features/)

| Fájl | Scenariók | Tagek | Leírás |
|------|-----------|-------|--------|
| **cookie.feature** | 1 | @cookie | Cookie banner elfogadás tesztelése |
| **dashboard.feature** | 1 | @dashboard | Dashboard grafikonok megjelenítése |
| **login.feature** | 3 | @login | Login/logout funkcionalitás |
| **savings.feature** | 4 | @savings | Megtakarítási számlák kezelése |

**Összesen**: 9 scenario + 5 scenario outline példa = **14 teszt eset**

### 🎭 Page Objects (src/pages/)

| Fájl | Felelősség | Selectorok | Metódusok |
|------|-----------|------------|-----------|
| **BasePage.ts** | Közös funkciók | - | 6 |
| **CookieBannerPage.ts** | Cookie banner | 5 | 9 |
| **HomePage.ts** | Dashboard/Home | 9 | 10 |
| **LoginPage.ts** | Login oldal | 5 | 7 |
| **NewSavingsAccountPage.ts** | Új számla | 4 | 10 |
| **ViewSavingsAccountsPage.ts** | Számlák lista | 3 | 13 |

**Összesen**: ~26 selector, ~55 metódus

### 🎬 Step Definitions (src/steps/)

| Fájl | Given | When | Then | Összesen |
|------|-------|------|------|----------|
| **DBankSteps.ts** | 5 | 8 | 12 | 25+ steps |

**Kapcsolódó page objektumok**: Mind a 6 page használva

### ⚙️ Support Files (src/support/)

| Fájl | Funkció | Hooks |
|------|---------|-------|
| **hooks.ts** | Browser lifecycle | Before, After, BeforeAll, AfterAll |
| **world.ts** | Context definition | CustomWorld interface |
| **report.js** | Report generation | - |

### 🛠️ Utility Files (src/utils/)

| Fájl | Funkciók |
|------|----------|
| **helpers.ts** | wait(), generateRandomString(), takeScreenshot(), scrollToElement(), formatDate() |

---

## 🔧 Konfigurációs Fájlok

### package.json
```json
{
  "name": "digitalbank-playwright-cucumber-typescript",
  "scripts": {
    "test": "cucumber-js",
    "test:parallel": "cucumber-js --parallel 2",
    "test:login": "cucumber-js --tags @login",
    "test:cookie": "cucumber-js --tags @cookie",
    "test:dashboard": "cucumber-js --tags @dashboard",
    "test:savings": "cucumber-js --tags @savings",
    "report": "node src/support/report.js"
  }
}
```

### cucumber.js
```javascript
{
  require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
  format: ['html', 'json', 'junit'],
  paths: ['src/features/**/*.feature']
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true
  }
}
```

### playwright.config.ts
```typescript
{
  baseURL: 'http://localhost:3000',
  projects: ['chromium', 'firefox', 'webkit']
}
```

---

## 📊 Méret Összefoglalás

### Forráskód
```
src/
├── features/     ~150 sor  (Gherkin)
├── pages/        ~700 sor  (TypeScript)
├── steps/        ~400 sor  (TypeScript)
├── support/      ~200 sor  (TypeScript + JS)
└── utils/        ~100 sor  (TypeScript)

Összesen: ~1,550 sor
```

### Dokumentáció
```
README_DIGITALBANK.md     ~450 sor
SETUP_GUIDE.md            ~500 sor
MIGRATION_NOTES.md        ~600 sor
QUICK_REFERENCE.md        ~400 sor
CONVERSION_SUMMARY.md     ~400 sor
PROJECT_STRUCTURE.md      ~200 sor

Összesen: ~2,550 sor
```

### Konfiguráció
```
package.json              ~35 sor
tsconfig.json            ~25 sor
cucumber.js              ~15 sor
playwright.config.ts     ~25 sor
.gitignore               ~12 sor

Összesen: ~112 sor
```

**Teljes projekt méret**: ~4,200+ sor kód és dokumentáció

---

## 🎯 Felelősségi Körök

### Page Objects Felelősség

```mermaid
BasePage (abstract)
    ├── Common functionality
    │   ├── getPageTitle()
    │   ├── getCurrentUrl()
    │   ├── refreshPage()
    │   ├── goBack()
    │   ├── goForward()
    │   └── takeScreenshot()
    │
    ├── CookieBannerPage
    │   └── Cookie interactions
    │
    ├── LoginPage
    │   └── Authentication
    │
    ├── HomePage
    │   └── Dashboard operations
    │
    ├── NewSavingsAccountPage
    │   └── Account creation
    │
    └── ViewSavingsAccountsPage
        └── Account viewing
```

### Step Definitions Csoportok

```
DBankSteps.ts
├── Login Steps          (6 steps)
│   ├── I am on the login page
│   ├── I login with {username} and {password}
│   ├── I am logged in
│   └── ...
│
├── Cookie Steps         (3 steps)
│   ├── I see the cookie banner
│   ├── I accept the cookies
│   └── the cookie banner disappears
│
├── Dashboard Steps      (1 step)
│   └── I see the chart {chartName}
│
├── Navigation Steps     (3 steps)
│   ├── I am on the {page} page
│   ├── I open the {page} page
│   └── I am redirected to the {page} page
│
├── Savings Steps        (10 steps)
│   ├── Form manipulation
│   ├── Account creation
│   └── Data verification
│
└── Assertion Steps      (6 steps)
    ├── I see a message
    ├── I see the welcome message
    └── ...
```

---

## 🔄 Data Flow

### Test Execution Flow

```
1. Cucumber reads feature files
   └── src/features/*.feature

2. Cucumber matches steps
   └── src/steps/DBankSteps.ts

3. Steps use Page Objects
   └── src/pages/*.ts
       ├── BasePage (common)
       └── Specific pages

4. Hooks manage lifecycle
   └── src/support/hooks.ts
       ├── Before: Setup browser
       ├── After: Cleanup & screenshot
       └── World: Share context

5. Reports generated
   └── reports/
       ├── cucumber-report.html
       ├── screenshots/
       └── videos/
```

### Context Sharing

```
World (CustomWorld)
    ├── page: Page
    ├── context: BrowserContext
    ├── browser: Browser
    └── attach: Function (for screenshots)
         ↓
    Step Functions
         ↓
    Page Objects
         ↓
    Playwright API
```

---

## 🎨 Naming Conventions

### Files
- **Page Objects**: `{PageName}Page.ts` (PascalCase)
- **Steps**: `{Feature}Steps.ts` (PascalCase)
- **Features**: `{feature-name}.feature` (kebab-case)
- **Utils**: `{utility-name}.ts` (kebab-case)

### Classes & Interfaces
- **Classes**: `PascalCase` (e.g., `LoginPage`)
- **Interfaces**: `PascalCase` (e.g., `CustomWorld`)

### Methods & Functions
- **Methods**: `camelCase` (e.g., `enterUsername`)
- **Functions**: `camelCase` (e.g., `iAmOnTheLoginPage`)

### Variables
- **Local**: `camelCase` (e.g., `username`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `LOGIN_PAGE_URL`)
- **Private fields**: `camelCase` with `private` (e.g., `private usernameField`)

---

## 📚 Dokumentáció Mátrix

| Dokumentum | Célcsoport | Cél | Prioritás |
|------------|-----------|-----|-----------|
| **README_DIGITALBANK.md** | Összes | Projekt overview, átírás részletei | ⭐⭐⭐ |
| **SETUP_GUIDE.md** | Új fejlesztők | Telepítés, futtatás, debug | ⭐⭐⭐ |
| **MIGRATION_NOTES.md** | Fejlesztők | Átírási minták, összehasonlítások | ⭐⭐ |
| **QUICK_REFERENCE.md** | Mindenki | Gyors parancsok, tippek | ⭐⭐⭐ |
| **CONVERSION_SUMMARY.md** | Vezetők, PM | Átírás eredményei, ROI | ⭐⭐ |
| **PROJECT_STRUCTURE.md** | Új fejlesztők | Navigáció, struktúra | ⭐⭐⭐ |

---

## 🎯 Usage Recommendations

### Új fejlesztőknek

1. Kezdd: **SETUP_GUIDE.md**
2. Folytasd: **QUICK_REFERENCE.md**
3. Mélyedj el: **README_DIGITALBANK.md**
4. Navigálj: **PROJECT_STRUCTURE.md** (ez a fájl)

### Tapasztalt fejlesztőknek

1. Gyors start: **QUICK_REFERENCE.md**
2. Átírási minták: **MIGRATION_NOTES.md**
3. Kód struktúra: **PROJECT_STRUCTURE.md** (ez a fájl)

### Projektvezetőknek

1. Eredmények: **CONVERSION_SUMMARY.md**
2. Projekt overview: **README_DIGITALBANK.md**

---

## 🔍 Quick Navigation

**Új teszt hozzáadása?** → `src/features/` + `src/steps/DBankSteps.ts`  
**Új page object?** → `src/pages/` + extend `BasePage`  
**Config módosítás?** → `cucumber.js`, `playwright.config.ts`, `tsconfig.json`  
**Riport nézés?** → `reports/cucumber-report.html`  
**Debug?** → `SETUP_GUIDE.md` → Debug section  
**Dokumentáció?** → `README_DIGITALBANK.md`

---

## ✅ Checklist - Amit tudnod kell

- [ ] Ismerem a projekt struktúrát
- [ ] Tudom, hol vannak a feature fájlok
- [ ] Tudom, hol vannak a page objektumok
- [ ] Tudom, hol vannak a step definitions
- [ ] Ismerem a futtatási parancsokat
- [ ] Tudom, hogyan generálok riportot
- [ ] Tudom, hogyan debug-olok
- [ ] Ismerem a dokumentációkat

---

**Verzió**: 1.0.0  
**Utolsó frissítés**: 2026-01-12  
**Karbantartó**: Test Automation Team

**Happy Testing! 🎭🚀**

