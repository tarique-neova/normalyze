# Runtime Team - Playwright UI Implementation

This is an automation implementation of Playwright using Typescript to test the new Investigations UI Feature. The whole idea is to leverage playwright's capability of mocking API data and use it for ui testing.

## Some details..

We're using Playwright @latest and Node @latest-LTS versions.

#### Project structure:

```
root
├── pages (the page object folder)
├── tests (where tests are defined)
├── helpers (contains fixtures)
└── utils (contains shared methods)

After test execution:

root
├── playwright-report (contains the html report)
├── screenshots (contains the baselines for visual testing)
└── tests-results (contains the tests screenshots and videos if enabled.)
```

#### ToDo:

    - Under Development

## Installation (For More Details - https://playwright.dev/docs/intro)

## Usage

To Run on your local -
    npx playwright test
