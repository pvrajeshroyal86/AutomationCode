const { waitForPaceLoader } = require('../library/utils/webUtils');

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
    await this.page.click(this.continueBtn);
    await waitForPaceLoader(this.page);
  }

  /**
   * Validates the page header and selects HR manual entry.
   */
  async validatePageHeaderAndSelectHRManualEntry() {
    let title = this.page.locator('h1.main-title');
    await this.page.click('.buttons.mobile_text-center .skip');
  }

  /**
   * Retrieves the employee ID from the URL.
   * @returns {string} The employee ID.
   */
  async getEmployeeId() {
    const newPersonId = this.page.url().split('/').reverse()[0];
    return newPersonId;
  }

  /**
   * Navigates to the people home page.
   */
  async navigateToPeopleHomePage() {
    await this.page.click('a.link[href="/people"]');
    await waitForPaceLoader(this.page);
  }
}

module.exports = CreateEmployeePage;