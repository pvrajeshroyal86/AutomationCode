const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const CalendarPage = require('../pages/calendarPage');
const { waitForPaceLoader } = require('../library/utils/webUtils');

/**
 * Test to apply sick leave for an employee.
 */
test('Apply Sick Leave', async ({ page }) => {
  const employeeName = 'Carla Kleermaekers';
  const leaveType = 'Sick day';

  // Navigate to the calendar page
  await page.goto(data.baseUrl + 'calendar');
  await waitForPaceLoader(page);

  const calendarPage = new CalendarPage(page);

  // Search for the employee
  await calendarPage.searchEmployee(employeeName);

  // Get the RGB value of the leave type
  const rgbValue = await calendarPage.getColorOfCalendarType(leaveType);

  // Remove any existing sick days for the employee
  await calendarPage.removeSickDaysApplied(employeeName, rgbValue);

  // Get the initial count of sick leaves
  const initialLeaveCount = await calendarPage.getInitialSickLeavesCountForEmployee(employeeName, rgbValue);

  // Select days off
  const countOfLeaves = await calendarPage.selectDaysOff();

  // Select the calendar type
  await calendarPage.selectCalendarType(leaveType);

  // Validate the sick leaves taken count
  await calendarPage.validateSickLeavesTakenCount(employeeName, countOfLeaves, initialLeaveCount, rgbValue);

  // Verify the sick leaves taken count
  const personRow = page.locator(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
  await expect(personRow.locator(`.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="${rgbValue}"]`)).toHaveCount(initialLeaveCount + countOfLeaves);

  // Remove the sick days applied
  await calendarPage.removeSickDaysApplied(employeeName, rgbValue);
});