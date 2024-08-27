const { test } = require('@playwright/test');
const data = require('../environment.json');
const Login = require('../pages/loginPage');
const Calendar = require('../pages/calendarPage');
const { waitForPaceLoader } = require('../utils/webUtils');

/**
 * Test to apply sick leave for an employee.
 */
test('Apply Sick Leave', async ({ page }) => {
    const employeeName = 'Carla Kleermaekers';
    const leaveType = 'Sick day';

    const login = new Login(page);
    await page.goto(data.baseUrl + 'calendar');
    await login.signIn(data.userName, data.password);
    await waitForPaceLoader(page);

    const calendar = new Calendar(page);    
    await calendar.searchEmployee(employeeName);
    const rgbValue = await calendar.getColorOfCalendarType(leaveType);
    await calendar.removeSickDaysApplied(employeeName, rgbValue);
    const initialLeaveCount = await calendar.getInitialSickLeavesCountForEmployee(employeeName, rgbValue);
    const countOfLeaves = await calendar.selectDaysOff();
    await calendar.selectCalendarType(leaveType);
    await calendar.validateSickLeavesTakenCount(employeeName, countOfLeaves, initialLeaveCount, rgbValue);
    await calendar.removeSickDaysApplied(employeeName, rgbValue);
});