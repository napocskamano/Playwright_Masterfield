# Digital Bank - Telepítési és Futtatási Útmutató

## 📋 Előfeltételek

Győződj meg róla, hogy telepítve van:

- **Node.js** (v18 vagy újabb)
- **npm** (általában Node.js-sel együtt települ)
- **Git** (opcionális, verziókezeléshez)

Node.js verzió ellenőrzése:
```bash
node --version
npm --version
```

## 🔧 Telepítés lépésről lépésre

### 1. Lépés: Projekt inicializálása

```bash
# Navigálj a projekt mappába
cd Playwright_Masterfield

# Függőségek telepítése
npm install
```

Ez telepíti az összes szükséges csomagot:
- `@cucumber/cucumber` - BDD framework
- `@playwright/test` - Playwright test library
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript futtatáshoz
- `cucumber-html-reporter` - HTML riport generáláshoz

### 2. Lépés: Playwright böngészők telepítése

```bash
npx playwright install
```

Ez letölti a következő böngészőket:
- Chromium
- Firefox  
- WebKit (Safari)

Ha csak Chromium-ot szeretnél:
```bash
npx playwright install chromium
```

### 3. Lépés: Környezeti változók (opcionális)

A `.env.example` fájl már tartalmazza a szükséges változókat. Ha módosítani szeretnéd őket:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Majd szerkeszd a `.env` fájlt igény szerint.

### 4. Lépés: TypeScript ellenőrzés

Ellenőrizd, hogy nincs-e típushiba:

```bash
npm run pretest
```

Ha ez sikeres, minden rendben van!

## 🚀 Tesztek futtatása

### Alapvető futtatások

```bash
# ÖSSZES teszt futtatása
npm test

# Tesztek futtatása párhuzamosan (gyorsabb)
npm run test:parallel
```

### Funkció alapú futtatás

```bash
# Csak login/logout tesztek
npm run test:login

# Csak cookie banner tesztek
npm run test:cookie

# Csak dashboard tesztek
npm run test:dashboard

# Csak savings account tesztek
npm run test:savings
```

### Tag alapú futtatás

```bash
# Egyedi tag
npm run test:tag @login

# Több tag (OR)
npm run test:tag "@login or @cookie"

# Tag kombináció (AND)
npm run test:tag "@login and @smoke"

# Tag kizárása
npm run test:tag "not @wip"
```

### Specifikus feature fájl futtatása

```bash
npx cucumber-js src/features/login.feature
```

### Specifikus scenario futtatása

```bash
npx cucumber-js src/features/login.feature:12
```
(ahol 12 a scenario sor száma)

## 📊 Riportok

### Riport generálása

A tesztek futtatása után:

```bash
npm run report
```

Ez létrehozza:
- `reports/cucumber-report.html` - Böngészőben megnyitható HTML riport
- `reports/cucumber-report.json` - JSON formátumú riport
- `reports/cucumber-report.xml` - JUnit XML riport (CI/CD-hez)

### HTML riport megnyitása

**Windows:**
```bash
start reports/cucumber-report.html
```

**Mac:**
```bash
open reports/cucumber-report.html
```

**Linux:**
```bash
xdg-open reports/cucumber-report.html
```

### Screenshot-ok és videók

Sikertelen tesztek esetén automatikusan készülnek:
- **Screenshots**: `reports/screenshots/`
- **Videos**: `reports/videos/`

## 🐛 Hibakeresés

### 1. Böngésző láthatóvá tétele (Headed mode)

Módosítsd a `src/support/hooks.ts` fájlban:

```typescript
Before(async function () {
  browser = await chromium.launch({
    headless: false,  // ← Változtasd false-ra
    slowMo: 500,      // ← Lassított lejátszás (ms)
  });
  // ...
});
```

### 2. Lassított futtatás

A `slowMo` értékét növeld:

```typescript
browser = await chromium.launch({
  headless: false,
  slowMo: 1000,  // 1 másodperc késleltetés lépések között
});
```

### 3. Debug üzenetek

A step definitions-ben használhatsz console.log-ot:

```typescript
@When('I login with {string} and {string}')
async function iLoginWithAnd(this: CustomWorld, username: string, password: string) {
  console.log(`Attempting login with username: ${username}`);
  await loginPage.login(username, password);
}
```

### 4. Playwright Inspector

Futtatás debug módban:

```bash
PWDEBUG=1 npm test
```

Ez megnyitja a Playwright Inspector-t, ahol lépésről lépésre követheted a teszteket.

### 5. Timeout növelése

Ha lassú a hálózat, növeld a timeout-ot a `src/pages/BasePage.ts`-ben:

```typescript
protected readonly timeout: number = 30000; // 30 másodperc
```

## 🔍 Gyakori problémák

### Problem 1: "Cannot find module" hiba

**Megoldás:**
```bash
# Töröld a node_modules mappát és telepítsd újra
rm -rf node_modules
npm install
```

### Problem 2: "Browser not found" hiba

**Megoldás:**
```bash
npx playwright install
```

### Problem 3: TypeScript fordítási hibák

**Megoldás:**
```bash
# Ellenőrizd a TypeScript konfigurációt
npm run pretest

# Ha szükséges, telepítsd újra a típusdefiníciókat
npm install --save-dev @types/node
```

### Problem 4: Port foglalt

Ha a böngésző nem indul el, ellenőrizd, hogy nincs-e már futó példány.

**Windows:**
```bash
tasklist | findstr chrome
taskkill /F /IM chrome.exe
```

**Linux/Mac:**
```bash
ps aux | grep chrome
pkill chrome
```

### Problem 5: Teszt timeout

Ha a tesztek túl sokáig futnak:

1. Növeld a timeout-ot a cucumber.js-ben:
```javascript
// cucumber.js
module.exports = {
  default: {
    timeout: 60000  // 60 másodperc
  }
};
```

2. Vagy használj specifikus timeout-ot a step-ben:
```typescript
@Given('I am on the login page', { timeout: 30000 })
async function iAmOnTheLoginPage(this: CustomWorld) {
  // ...
}
```

## 📦 Projekt struktúra áttekintése

```
Playwright_Masterfield/
│
├── src/
│   ├── features/          ← Feature fájlok (Gherkin)
│   ├── pages/             ← Page Object Model
│   ├── steps/             ← Step definitions
│   ├── support/           ← Hooks, World
│   └── utils/             ← Helper funkciók
│
├── reports/               ← Generált riportok
├── Temp/                  ← Eredeti Java projekt
│
├── package.json           ← npm konfiguráció
├── tsconfig.json          ← TypeScript konfiguráció
├── cucumber.js            ← Cucumber konfiguráció
├── playwright.config.ts   ← Playwright konfiguráció
│
└── README_DIGITALBANK.md  ← Projekt dokumentáció
```

## 🎯 Első teszt futtatása

1. **Telepítés ellenőrzése:**
```bash
npm run pretest
```

2. **Egy egyszerű teszt futtatása:**
```bash
npm run test:cookie
```

3. **Ha sikeres, futtasd az összeset:**
```bash
npm test
```

4. **Riport generálása és megtekintése:**
```bash
npm run report
start reports/cucumber-report.html  # Windows
```

## 🚦 CI/CD integráció (GitHub Actions)

Hozz létre egy `.github/workflows/tests.yml` fájlt:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run tests
        run: npm test
      
      - name: Generate report
        if: always()
        run: npm run report
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: reports/
```

## 📞 Segítség

Ha problémába ütközöl:

1. Ellenőrizd a `reports/` mappában a screenshot-okat
2. Nézd meg a konzol kimenetét
3. Futtasd debug módban: `PWDEBUG=1 npm test`
4. Ellenőrizd a dokumentációt: [README_DIGITALBANK.md](./README_DIGITALBANK.md)

## ✅ Ellenőrző lista

- [ ] Node.js telepítve (v18+)
- [ ] `npm install` futtatva
- [ ] `npx playwright install` futtatva
- [ ] TypeScript ellenőrzés sikeres (`npm run pretest`)
- [ ] Cookie teszt sikeres (`npm run test:cookie`)
- [ ] Összes teszt sikeres (`npm test`)
- [ ] Riport generálva (`npm run report`)

---

**Készült**: 2026-01-12  
**Verzió**: 1.0.0

