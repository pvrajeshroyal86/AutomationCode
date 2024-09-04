# Playwright Automation for Officient PHP Project

## How to start

1. Run `npm install`. This will install all the node modules into the project and get it ready to start writing tests.
2. Run `npx playwright install` to install the necessary browsers for Playwright.
3. Run `npx playwright test` to run all the tests and generate the HTML reports.
4. Run `npx playwright test <specific test>` to run a specific test file.

## Project Structure

AUTOMATIONCODE/ 
    ├── .auth/ # Directory for storing authentication state 
    ├── alllure-results 
    ├── config/ # Configuration files 
        │ └── authentication.js # Script for handling authentication 
    ├── pages/ # Page Object Models 
        │ └── createEmployeePage.js # Page object for the Create Employee page
    ├── test-results  
    ├── tests/ # Test files 
        │ └── employee.spec.js # Test spec for employee-related tests 
    ├── utils/ # Utility functions 
        │ └──fakerLibrary.js # Utility functions for generating fake data 
        │ └── webUtils.js # Utility functions for web interactions 
    ├── .gitignore # Git ignore file 
    ├── environment.json # Environment-specific data 
    ├── package.json # NPM package configuration 
    ├── playwright.config.js # Playwright configuration file 
    └── README.md # Project documentation


## Configuration

### Playwright Configuration

The Playwright configuration is defined in [`playwright.config.js`]
This file includes settings for browser options, test directory, timeouts, and more.

### Authentication

The authentication script `authentication.js` is located in the [`config`] directory. 
It handles the login process and saves the authentication state in the [`.auth`] directory.

## Writing Tests

Tests are located in the [`tests`] directory. 
Each test file should follow the naming convention `*.spec.js`.

### Utilities

Utility functions are located in the utils directory. These functions help with common tasks such as generating fake data and interacting with web elements.

## Faker Library

The fakerLibrary.js file contains functions for generating fake data such as names and emails.

## Web Utilities

The webUtils.js file contains functions for interacting with web elements, such as waiting for loaders to disappear.

### Running Tests

To run the tests, use the following command: npx playwright test

### Reports

Test reports are generated in the test-results directory. You can view the failure reports/vedios for analysis.