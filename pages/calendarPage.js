const { expect } = require('@playwright/test');

class CalendarPage {
  constructor(page) {
    this.page = page;
    this.searchEmployeeField = page.locator('.month-calendar-header .search input');
    this.firstSearchResult = page.locator('.person_name').first();
    this.addLeaveOption = page.locator('.buttons.fixed-bottom .button.blue');
    this.titleInCalendarPopup = page.locator('.sidebar-title-section');
    this.selectCalendarTypeDropdown = page.locator('.dropdown.select-dayoff-type');
    this.totalTime = page.locator('//label[.="Total time"]/..//input');
    this.confirmBtn = page.locator('.page-sidebar .button');
    this.deleteLeaveOption = page.locator('.buttons.fixed-bottom .button.red');
    this.deleteBtn = page.locator('.page-sidebar .button.red');
    this.availableDaysForEmployee = page.locator('.month-calendar-day.clickable.empty:not(.zeroSchedule):not(.nullSchedule)');
    this.closeLeaveWindow = page.locator('.close-icon-wrapper');
  }

  /**
   * Selects the calendar type for leave.
   * @param {string} calendarType - The type of calendar leave.
   */
  async selectCalendarType(calendarType) {
    await this.addLeaveOption.click();
    await this.page.waitForSelector(`.dropdown.select-dayoff-type`);
    await this.selectCalendarTypeDropdown.click();
    await this.page.locator(`.page-sidebar .menu .tr:has-text("${calendarType}")`).click();
    await this.confirmBtn.click();
  }

  /**
   * Selects the leave period.
   * @param {string} leavePeriod - The period of leave.
   */
  async selectLeavePeriod(leavePeriod) {
    const normalizedLeavePeriod = leavePeriod.toLowerCase().replace(/\s+/g, '');

    switch (normalizedLeavePeriod) {
      case 'allday':
        await this.selectLeaveOption('All Day');
        break;
      case 'morning':
        await this.selectLeaveOption('Morning');
        break;
      case 'afternoon':
        await this.selectLeaveOption('Afternoon');
        break;
      case 'specifichours':
        await this.selectLeaveOption('Specific Hours');
        break;
      default:
        console.log('Invalid leave period option');
        break;
    }
  }

  /**
   * Selects the number of days off.
   * @param {number} daysToSelect - The number of days to select.
   * @returns {number} - The number of days selected.
   */
  async selectDaysOff(daysToSelect) {
    const DAYOFF_REQUEST_LIMIT = Math.floor(Math.random() * daysToSelect) + 1;
    for (let index = 0; index < DAYOFF_REQUEST_LIMIT; index++) {
      await this.availableDaysForEmployee.nth(index).click();
    }
    return DAYOFF_REQUEST_LIMIT;
  }

  /**
   * Searches for an employee.
   * @param {string} employeeName - The name of the employee.
   */
  async searchEmployee(employeeName) {
    await this.searchEmployeeField.fill(employeeName);
  }

  /**
   * Gets the initial sick leaves count for an employee.
   * @param {string} employeeName - The name of the employee.
   * @param {string} rgbValue - The RGB value of the leave type.
   * @returns {number} - The initial sick leaves count.
   */
  async getInitialSickLeavesCountForEmployee(employeeName, rgbValue) {
    const personRow = this.page.locator(`//div[@class='month-calendar-row' and contains(text(),'${employeeName}')]`);
    const initialCount = await personRow.locator(`.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="${rgbValue}"]`).count();
    return initialCount;
  }

  /**
   * Gets the color of the calendar type.
   * @param {string} leaveType - The type of leave.
   * @returns {string} - The RGB value of the leave type.
   */
  async getColorOfCalendarType(leaveType) {
    await this.availableDaysForEmployee.nth(0).click();   
    await this.addLeaveOption.click();
    await this.selectCalendarTypeDropdown.click();
    await this.page.locator(`.page-sidebar .menu .tr:has-text("${leaveType}")`).click();
    const rgbValue = await this.page.$eval('.bar.approved', element => window.getComputedStyle(element).backgroundColor);
    console.log('The RGB value:', rgbValue);
    await this.closeLeaveWindow.click();
    return rgbValue;
  }

  /**
   * Validates the sick leaves taken count.
   * @param {number} countOfLeaves - The number of leaves taken.
   * @param {number} initialCount - The initial count of leaves.
   * @param {string} rgbValue - The RGB value of the leave type.
   */
  async validateSickLeavesTakenCount(employeeName, countOfLeaves, initialCount, rgbValue) {
    await this.page.waitForSelector(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]//div[contains(@style,"${rgbValue}")]`);
    const personRow = this.page.locator(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
    await expect(personRow.locator(`.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="${rgbValue}"]`)).toHaveCount(initialCount + countOfLeaves);
  }

  /**
   * Removes the sick days applied for an employee.
   * @param {string} employeeName - The name of the employee.
   * @param {string} rgbValue - The RGB value of the leave type.
   */
  async removeSickDaysApplied(employeeName, rgbValue) {
    await this.page.waitForSelector(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
    const personRow = this.page.locator(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
    const daysToRemove = personRow.locator(`.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="${rgbValue}"]`);
    const daysCount = await daysToRemove.count();

    if(daysCount === 0) return;

    for (let index = 0; index < daysCount; index++) {
      await daysToRemove.nth(index).click();
    }

    await this.deleteLeaveOption.click();
    await this.page.waitForSelector(`.page-sidebar .button.red`);
    await this.deleteBtn.click();
  }

  /**
   * Gets the available days count for an employee.
   * @param {string} employeeName - The name of the employee.
   * @returns {number} - The count of available days.
   */
  async getAvailableDaysCount(employeeName) {
    await this.page.waitForSelector(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
    const personRow = this.page.locator(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
    const availableDaysCount = await personRow.locator('.month-calendar-day.clickable.empty:not(.zeroSchedule):not(.nullSchedule)').count();
    return availableDaysCount;
  }
}

module.exports = CalendarPage;