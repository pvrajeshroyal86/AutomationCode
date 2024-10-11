const { expect } = require('@playwright/test');

class EmpCalendar{
    constructor(page){
        this.page = page;
        this.locators = {
            yearCalendar: '.YearCalendar',
            intialCountOfDaysBlocked:(MONTH) => `.calendars .calendar:nth-child(${MONTH}) .clickable.active:not(.zeroSchedule):not(:has(.company))`,
            daysToSelect:(MONTH) => `.calendars .calendar:nth-child(${MONTH}) .clickable:not(.active):not(.zeroSchedule):not(:has(.company))`,
            addDaysBtn:`.buttons.fixed-bottom .button.blue`,
            calendarTypeDropDown:`.dropdown.select-dayoff-type`,
            selectCalendar:(calendarType) => `.page-sidebar .menu .tr:has-text("${calendarType}")`,
            confirmBtn:`.page-sidebar .button`,
            finalCountOfDaysBlocked:(MONTH) => `.calendars .calendar:nth-child(${MONTH}) .clickable.active:not(.zeroSchedule):not(:has(.company))`,
            daysToRemove:(MONTH) => `.calendars .calendar:nth-child(${MONTH}) .clickable.active:not(.zeroSchedule):not(:has(.company))`,
            deleteDaysBtn:`.buttons.fixed-bottom .button.red`,
            deleteSlotBtn:`.page-sidebar .button.red`,
            checkDaysRemoved:(MONTH) => `.calendars .calendar:nth-child(${MONTH}) .clickable.active:not(.zeroSchedule):not(:has(.company))`
             };
    }

    async waitForEmployeeYearCalendarAndReturnInitialCountOfDaysBlocked(MONTH){
        await this.page.waitForSelector(this.locators.yearCalendar);
        return this.page.locator(this.locators.intialCountOfDaysBlocked(MONTH)).count();
    }

     /**
   * Selects the number of days off.
   * @returns {number} - The number of days selected.
   */
  async selectDaysOff(MONTH) {
    const DAYOFF_REQUEST_LIMIT = 3;
    for (let index = 0; index < DAYOFF_REQUEST_LIMIT; index++) {
      await this.page.locator(this.locators.daysToSelect(MONTH)).nth(index).click();
    }
    await this.page.locator(this.locators.addDaysBtn).click();
    return DAYOFF_REQUEST_LIMIT;
  }

  /**
   * Selects the calendar type for leave.
   * @param {string} calendarType - The type of calendar leave.
   */
  async selectCalendarType(calendarType) {
    await this.page.locator(this.locators.calendarTypeDropDown).click();
    await this.page.locator(this.locators.selectCalendar(calendarType)).click();
    await this.page.locator(this.locators.confirmBtn).click();
  }

  async validateNewlyBlockedAndIntialBlockedDaysCountSum(MONTH,initialCount,DAYOFF_REQUEST_LIMIT){
    await expect(this.page.locator(this.locators.finalCountOfDaysBlocked(MONTH))).toHaveCount(initialCount + DAYOFF_REQUEST_LIMIT);
  }

  async removeSelectedDaysOff(MONTH){
    const daysToRemove = this.page.locator(this.locators.daysToRemove(MONTH));
    const daysCount = await daysToRemove.count();

    if (daysCount === 0) return;

    for (let index = 0; index < daysCount; index++) {
      await daysToRemove.nth(index).click();
    }
    await this.page.locator(this.locators.deleteDaysBtn).click();
    await this.page.locator(this.locators.deleteSlotBtn).click();
  }

  async checkDaysWereRemoved(MONTH){
    await expect(this.page.locator(this.locators.checkDaysRemoved(MONTH))).toHaveCount(0);
  }

}

module.exports = EmpCalendar;