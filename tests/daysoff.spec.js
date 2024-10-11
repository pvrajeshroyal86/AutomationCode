const { test,expect } = require('@playwright/test');
const data = require('../environment.json');
const { waitForPaceLoader } = require('../utils/webUtils');
const empCalendar = require('../pages/EmpCalendar');

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getUTCMonth() + 1; // getUTCMonth returns 0-11, Officient works with 1-12
const YEAR = CURRENT_MONTH + 1 > 12 ? CURRENT_YEAR + 1 : CURRENT_YEAR;
const MONTH = CURRENT_MONTH + 1 > 12 ? 1 : CURRENT_MONTH + 1;

test('request days off', async ({ page }) => {
    const personId = 21312; // Stephanie Ramant
    const empCalendarPage = new empCalendar(page);
  
    await page.goto(data.baseUrl+`people/${personId}/daysOff?year=${YEAR}`);
    await waitForPaceLoader(page);
    const initialBlockedDaysCount=await empCalendarPage.waitForEmployeeYearCalendarAndReturnInitialCountOfDaysBlocked(MONTH);
    const NoOfDaysBlocked=await empCalendarPage.selectDaysOff(MONTH);
    await empCalendarPage.selectCalendarType('Wettelijk verlof');
    await waitForPaceLoader(page);
    await empCalendarPage.validateNewlyBlockedAndIntialBlockedDaysCountSum(MONTH,initialBlockedDaysCount,NoOfDaysBlocked);
    await empCalendarPage.removeSelectedDaysOff(MONTH);
    await waitForPaceLoader(page);
    await empCalendarPage.checkDaysWereRemoved(MONTH);
  });
  