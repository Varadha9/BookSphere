# 🧪 BookSphere — Selenium Test Suite

> Hybrid Automation Framework: Java 17 · Selenium 4.18 · TestNG 7.9 · Cucumber 7.15 · Maven

---

## 📋 Overview

BookSphere's test suite is a hybrid framework combining:

- **Selenium WebDriver** — browser automation for UI tests
- **TestNG** — test lifecycle management, grouping, and data-driven testing
- **Cucumber BDD** — human-readable `.feature` files for login scenarios
- **Page Object Model (POM)** — one class per page, selectors isolated from test logic
- **WebDriverManager** — auto-downloads and manages ChromeDriver binaries
- **Supabase REST API tests** — pure `HttpURLConnection` calls, no browser needed

---

## 🗂️ Project Structure

```
selenium-tests/
├── pom.xml                          ← Maven build + all dependency versions
├── testng.xml                       ← Suite config: groups, test order, classes
├── TEST_CASES.md                    ← 50 test cases with expected/actual results
├── BookSphere_TestCases.xlsx        ← Excel version of test cases
├── gen_testcases.py                 ← Script that generated TEST_CASES.md + xlsx
└── src/
    └── test/
        ├── java/
        │   └── com/booksphere/
        │       ├── utils/
        │       │   └── BaseTest.java          ← WebDriver setup/teardown
        │       ├── pages/                     ← Page Object Model classes
        │       │   ├── LoginPage.java
        │       │   ├── CatalogPage.java
        │       │   ├── CartPage.java
        │       │   └── OrdersPage.java
        │       ├── tests/                     ← TestNG test classes
        │       │   ├── LoginTest.java         ← 8 login tests (smoke + regression)
        │       │   ├── CatalogTest.java       ← 3 catalog tests
        │       │   ├── CartTest.java          ← 3 cart tests
        │       │   ├── ApiTest.java           ← 5 REST API tests
        │       │   └── LoginStepDefs.java     ← Cucumber step definitions
        │       └── runner/
        │           └── CucumberRunner.java    ← Hooks Cucumber into TestNG
        └── resources/
            └── features/
                └── login.feature              ← BDD scenarios for login
```

---

## ⚙️ Tech Stack & Versions

| Dependency | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Language |
| Maven | 3.x | Build tool |
| Selenium Java | 4.18.1 | Browser automation |
| WebDriverManager | 5.7.0 | Auto ChromeDriver management |
| TestNG | 7.9.0 | Test runner + grouping |
| Cucumber Java | 7.15.0 | BDD `.feature` files |
| Cucumber TestNG | 7.15.0 | Cucumber ↔ TestNG integration |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+ (`java -version`)
- Maven 3.6+ (`mvn -version`)
- Google Chrome installed (WebDriverManager handles the driver automatically)
- Internet access (tests run against the live Vercel deployment)

### Run All Tests

```bash
cd selenium-tests
mvn test
```

### Run a Specific Group

```bash
# Smoke tests only
mvn test -Dgroups=smoke

# Regression tests only
mvn test -Dgroups=regression

# API tests only
mvn test -Dgroups=api
```

### Run a Single Test Class

```bash
mvn test -Dtest=LoginTest
mvn test -Dtest=CartTest
mvn test -Dtest=ApiTest
```

---

## 🏗️ Architecture

### Base Class — `BaseTest.java`

Every UI test class extends `BaseTest`. It handles:

- `@BeforeMethod` — calls `WebDriverManager.chromedriver().setup()`, launches Chrome maximized, navigates to `https://booksphere-dun.vercel.app`
- `@AfterMethod` — calls `driver.quit()` to close the browser after every test

```
BaseTest
   ├── LoginTest
   ├── CatalogTest
   └── CartTest
```

### Page Object Model

Each page class owns its own selectors (as `By` fields) and exposes only high-level action/assertion methods. Tests never call `driver.findElement()` directly.

| Page Class | Selectors | Key Methods |
|------------|-----------|-------------|
| `LoginPage` | `input[type='email']`, `button.lf-submit`, `.lf-error-msg`, etc. | `login()`, `isErrorDisplayed()`, `clickShowPassword()`, `clickForgotPassword()` |
| `CatalogPage` | `input.search-input`, `.product-card`, `.tree-node`, `.add-to-cart-btn` | `searchFor()`, `getBookCardCount()`, `addFirstBookToCart()`, `isGenreTreeVisible()` |
| `CartPage` | `.cart-item`, `.remove-btn`, `.undo-btn`, `input.coupon-input`, `.discount-value` | `getCartItemCount()`, `removeFirstItem()`, `clickUndo()`, `applyCoupon()`, `isDiscountApplied()` |
| `OrdersPage` | `.order-card`, `.order-status`, `.order-priority` | `getOrderCount()`, `getFirstOrderPriority()`, `isStatusBadgeVisible()` |

### TestNG Suite — `testng.xml`

Four test blocks run in order:

```
BookSphere Test Suite
├── Smoke Tests       → group: smoke   → LoginTest
├── Regression Tests  → group: regression → CatalogTest, CartTest
├── API Tests         → group: api     → ApiTest
└── BDD Tests                          → CucumberRunner
```

### BDD with Cucumber

`login.feature` defines 4 scenarios in plain English. `LoginStepDefs.java` maps each Gherkin step to Selenium actions. `CucumberRunner.java` plugs Cucumber into TestNG so both run together via `mvn test`.

---

## 🧩 Test Modules

### 🔐 LoginTest — 8 tests (`group: smoke` + `regression`)

| Test Method | TC ID | Group | What it verifies |
|-------------|-------|-------|-----------------|
| `testValidLogin` | TC_L_01 | smoke | Valid credentials → redirect away from `/login` |
| `testWrongPassword` | TC_L_02 | regression | Wrong password → `.lf-error-msg` visible |
| `testEmptyEmail` | TC_L_03 | regression | Empty email → inline `.lf-err-msg` shown |
| `testInvalidInputs` | TC_L_04/05 | regression | Data-driven: 3 bad credential combos → stays on login |
| `testPasswordToggle` | TC_L_06 | regression | `input[type]` toggles between `password` ↔ `text` |
| `testSwitchToSignUp` | TC_L_07 | regression | Sign Up toggle → Full Name field appears |
| `testForgotPassword` | TC_L_08 | regression | Forgot password → `.lf-status.lf-success` appears |

**Data Provider** (`invalidCreds`):
```
{ "",           PASS,   "empty email"    }
{ EMAIL,        "",     "empty password" }
{ "notanemail", PASS,   "invalid format" }
```

---

### 📚 CatalogTest — 3 tests (`group: regression`)

`@BeforeMethod` logs in first, then waits for `/catalog` URL before each test.

| Test Method | TC ID | What it verifies |
|-------------|-------|-----------------|
| `testBooksLoadOnCatalog` | TC_C_01 | At least one `.product-card` rendered |
| `testSearchFiltersBooks` | TC_C_02 | Searching "Atomic" reduces card count but returns ≥1 result |
| `testGenreTreeVisible` | TC_C_07 | `.tree-node` elements are visible on page |

---

### 🛒 CartTest — 3 tests (`group: regression`)

`@BeforeMethod` logs in, adds the first catalog book to cart, then navigates to `/cart`.

| Test Method | TC ID | DSA concept | What it verifies |
|-------------|-------|-------------|-----------------|
| `testBookAddedToCart` | TC_CA_01 | ArrayList | Cart has ≥1 `.cart-item` |
| `testUndoRemove` | TC_CA_05 | Stack (LIFO) | Remove item → Undo → count equals original |
| `testCouponApplied` | TC_CA_07 | DP Knapsack | Apply `BOOK30` → `.discount-value` element visible |

---

### 🔌 ApiTest — 5 tests (`group: api`)

No browser. Uses `java.net.HttpURLConnection` with Supabase `apikey` + `Authorization: Bearer` headers.

| Test Method | TC ID | Endpoint | Expected |
|-------------|-------|----------|---------|
| `testGetBooks_returns200` | TC_A_01 | `GET /rest/v1/books?select=*` | 200 |
| `testGetCoupons_returns200` | TC_A_02 | `GET /rest/v1/coupons?select=*` | 200 |
| `testGetBooksByCategory_Fiction` | TC_A_03 | `GET /rest/v1/books?select=*&category=eq.Fiction` | 200 |
| `testGetBooksSortedByPrice` | TC_A_04 | `GET /rest/v1/books?select=*&order=price.asc` | 200 |
| `testPrivateEndpoint_withoutJWT_returns401` | TC_A_05 | `GET /rest/v1/carts?select=*` (no Bearer) | 401 or 400 |

---

### 🥒 BDD — `login.feature` (4 scenarios)

```gherkin
Feature: User Login — BookSphere

  Scenario: Successful login with valid credentials     # TC_L_01
  Scenario: Login fails with wrong password             # TC_L_02
  Scenario: Login fails with empty email                # TC_L_03
  Scenario: Login fails with empty password             # TC_L_04
```

Gherkin steps map to `LoginStepDefs.java`:

| Step | Method |
|------|--------|
| `Given I am on the BookSphere login page` | `openLoginPage()` |
| `When I enter email {string} and password {string}` | `storeCredentials()` |
| `And I click the login button` | `clickLogin()` |
| `Then I should be redirected away from the login page` | `assertRedirected()` |
| `Then I should see an error message` | `assertError()` |
| `Then I should see a field validation error` | `assertFieldError()` |

---

## 📊 Test Suite Summary — 50 Test Cases

| Module | Automated | TC Range | Groups |
|--------|-----------|----------|--------|
| 🔐 Login | 8 (TestNG) + 4 (BDD) | TC_L_01–TC_L_14 | smoke, regression |
| 📚 Catalog | 3 | TC_C_01–TC_C_12 | regression |
| 🛒 Cart | 3 | TC_CA_01–TC_CA_12 | regression |
| 📦 Orders | — | TC_O_01–TC_O_07 | regression |
| 🔌 API | 5 | TC_A_01–TC_A_05 | api |

Full test case details (preconditions, steps, expected results, status): [`TEST_CASES.md`](../selenium-tests/TEST_CASES.md)

---

## 📈 Test Reports

After `mvn test`, reports are generated in `target/surefire-reports/`:

| Report | Path |
|--------|------|
| TestNG HTML | `target/surefire-reports/index.html` |
| Emailable report | `target/surefire-reports/emailable-report.html` |
| Cucumber HTML | `target/cucumber-report.html` |
| JUnit XML | `target/surefire-reports/TEST-TestSuite.xml` |

Open `target/surefire-reports/index.html` in a browser for the full interactive report.

---

## 🔧 Configuration

### `testng.xml` — Suite Structure

```xml
<suite name="BookSphere Test Suite" verbose="1">
  <test name="Smoke Tests">        <!-- LoginTest, group: smoke -->
  <test name="Regression Tests">   <!-- CatalogTest + CartTest, group: regression -->
  <test name="API Tests">          <!-- ApiTest, group: api -->
  <test name="BDD Tests">          <!-- CucumberRunner -->
</suite>
```

### `pom.xml` — Key Config

Maven Surefire plugin is pointed at `testng.xml`:
```xml
<suiteXmlFile>testng.xml</suiteXmlFile>
```

### Headless Mode (CI)

To run headless (no GUI, e.g. in CI/CD), add `--headless=new` to `BaseTest.java`:
```java
options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");
```

---

## 🧠 DSA Concepts Tested

| Feature Under Test | DSA | Test |
|-------------------|-----|------|
| Cart item storage | ArrayList | `testBookAddedToCart` |
| Undo remove | Stack (LIFO) | `testUndoRemove` |
| Coupon discount | 0/1 Knapsack DP | `testCouponApplied` |
| Book search | HashMap | `testSearchFiltersBooks` |
| Genre categories | N-ary Tree | `testGenreTreeVisible` |
| Private endpoint | Supabase RLS | `testPrivateEndpoint_withoutJWT_returns401` |

---

## 🛠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| ChromeDriver version mismatch | WebDriverManager handles this automatically — just `mvn test` |
| Tests fail on CI (no display) | Add `--headless=new` to `ChromeOptions` in `BaseTest` |
| `testWrongPassword` flaky | Supabase auth response can be slow — increase `WebDriverWait` timeout |
| BDD tests skipped | Ensure `features/login.feature` path matches `CucumberOptions` `features` field |
| 401 on API test | Verify `ANON_KEY` in `ApiTest.java` matches your Supabase project |

---

*BookSphere Selenium Suite — testing every DSA-powered feature end-to-end.*
