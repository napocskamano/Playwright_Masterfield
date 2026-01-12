# Playwright_Masterfield

Digital Bank Test Automation Project using Playwright with Cucumber and TypeScript

## Project Overview

This is a test automation project using **Playwright** with **Cucumber** for BDD (Behavior-Driven Development) test cases, written in **TypeScript**.

## Technology Stack

- **Playwright**: Modern web automation framework
- **Cucumber**: BDD framework for writing tests in Gherkin
- **TypeScript**: Strongly typed programming language
- **Node.js**: JavaScript runtime environment

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/napocskamano/Playwright_Masterfield.git
cd Playwright_Masterfield
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
Playwright_Masterfield/
├── features/              # Cucumber feature files (Gherkin)
├── src/
│   ├── pages/            # Page Object Model classes
│   ├── steps/            # Step definitions
│   └── support/          # Helper functions and hooks
├── test-results/         # Test execution results
├── playwright-report/    # HTML test reports
├── cucumber.json         # Cucumber configuration
├── playwright.config.ts  # Playwright configuration
└── tsconfig.json         # TypeScript configuration
```

## Running Tests

Execute all tests:
```bash
npm test
```

Run specific feature:
```bash
npm test -- --tags "@tagname"
```

Run in headed mode:
```bash
npm run test:headed
```

## Test Reports

After running tests, reports are generated in:
- HTML Report: `playwright-report/index.html`
- Cucumber JSON: `test-results/cucumber-report.json`

## Writing Tests

Tests are written in Gherkin syntax in `.feature` files located in the `features/` directory.

Example:
```gherkin
Feature: Login functionality
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    Then I should see the dashboard
```

