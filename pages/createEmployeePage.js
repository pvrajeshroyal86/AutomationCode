const { expect } = require('@playwright/test');
const { waitForPaceLoader } = require('../utils/webUtils');

class CreateEmployeePage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('h1.main-title');
    this.firstNameField = page.locator('input#inputfirstname');
    this.lastNameField = page.locator('input#inputname');
    this.emailField = page.locator('input#inputemail');
    this.continueBtn = '.step .button.blue';
  }

  /**
   * Validates the page header.
   */
  async getPageHeaderAndValidate() {
    await this.page.waitForSelector('h1.main-title');
    let title = this.page.locator('h1.main-title');
    await expect(title).toContainText('Add new person');
  }

  /**
   * Creates a new employee with the provided details.
   * @param {string} first - The first name of the employee.
   * @param {string} last - The last name of the employee.
   * @param {string} email - The email of the employee.
   */
  async createNewEmployee(first, last, email) {
    await this.firstNameField.fill(first);
    await this.lastNameField.fill(last);
    await this.emailField.fill(email);
    await expect(this.page.locator('.step .button.blue')).toBeVisible();
    await this.page.click('.step .button.blue');
    await waitForPaceLoader(this.page);
  }

  /**
   * Validates the page header and selects HR manual entry.
   */
  async validatePageHeaderAndSelectHRManualEntry() {
    let title = this.page.locator('h1.main-title');
    await expect(title).toContainText('Employee self onboarding');
    await expect(this.page.locator('.buttons.mobile_text-center .button')).toHaveCount(2);
    await this.page.click('.buttons.mobile_text-center .skip');
  }

  /**
   * Retrieves the employee ID from the URL.
   * @returns {string} The employee ID.
   */
  async getEmployeeId() {
    await expect(this.page).toHaveURL(/.*people\/\d+/);
    const newPersonId = this.page.url().split('/').reverse()[0];
    return newPersonId;
  }

  /**
   * Validates the employee card details.
   * @param {string} first - The first name of the employee.
   * @param {string} last - The last name of the employee.
   * @param {string} email - The email of the employee.
   */
  async validateEmployeeCard(first, last, email) {
    await expect(this.page.locator('.person-header .details .name')).toContainText(`${first} ${last}`);
    await expect(this.page.locator(`a:text("${email}")`)).toHaveCount(1);
    await expect(this.page.locator('.box.box-yellow')).toHaveCount(1);
    await expect(await this.page.locator('.ActivityFeed div.event:first-of-type .summary').innerText()).toMatch(new RegExp(`added ${first} ${last} as an employee`));
  }

  /**
   * Navigates to the people home page.
   */
  async navigateToPeopleHomePage() {
    await this.page.click('a.link[href="/people"]');
    await waitForPaceLoader(this.page);
    await expect(this.page).toHaveURL(/.*people/);
  }

  /**
   * Validates the employee in the people list.
   * @param {string} first - The first name of the employee.
   * @param {string} last - The last name of the employee.
   * @param {string} newPersonId - The ID of the new employee.
   */
  async validateEmployeeInPeopleList(first, last, newPersonId) {
    await expect(this.page.locator('.table.list.boxxed a.tr:first-of-type .flex > span')).toContainText(`${first} ${last}`);
    await expect(this.page.locator(`.table.list.boxxed a.tr:first-of-type[href="/people/${newPersonId}"]`)).toHaveCount(1);
  }
}

module.exports = CreateEmployeePage;