const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const { waitForPaceLoader } = require('../library/utils/webUtils');
const EmpCalendar = require('../pages/empCalendar');

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getUTCMonth() + 1; // getUTCMonth returns 0-11, Officient works with 1-12
const YEAR = CURRENT_MONTH + 1 > 12 ? CURRENT_YEAR + 1 : CURRENT_YEAR;
const MONTH = CURRENT_MONTH + 1 > 12 ? 1 : CURRENT_MONTH + 1;

test('request days off', async ({ page }) => {
  const personId = 21312; // Stephanie Ramant
  const empCalendarPage = new EmpCalendar(page);

  // Navigate to the employee's days off page
  await page.goto(data.baseUrl + `people/${personId}/daysOff?year=${YEAR}`);
  await waitForPaceLoader(page);

  // Get the initial count of blocked days
  const initialBlockedDaysCount = await empCalendarPage.waitForEmployeeYearCalendarAndReturnInitialCountOfDaysBlocked(MONTH);

  // Select days off
  const NoOfDaysBlocked = await empCalendarPage.selectDaysOff(MONTH);

  // Select the calendar type
  await empCalendarPage.selectCalendarType('Wettelijk verlof');
  await waitForPaceLoader(page);

  // Validate the newly blocked days and initial blocked days count sum
  await expect(page.locator(empCalendarPage.locators.finalCountOfDaysBlocked(MONTH))).toHaveCount(initialBlockedDaysCount + NoOfDaysBlocked);

  // Remove the selected days off
  await empCalendarPage.removeSelectedDaysOff(MONTH);
  await waitForPaceLoader(page);

  // Check that the days were removed
  await expect(page.locator(empCalendarPage.locators.checkDaysRemoved(MONTH))).toHaveCount(0);
});