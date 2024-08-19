const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const Login = require('../pages/loginPage');
const { faker } = require('@faker-js/faker');
const Calendar = require('../pages/calendarPage');   
const { waitForPaceLoader } = require('../utils/webUtils');
 
test('Apply Sick Leave', async ({ page }) => {
    const employeeName='Carla Kleermaekers';
    const leaveType='Sick Leave';
    
    const login = new Login(page);
    await page.goto(data.baseUrl + 'calendar');
    await login.signIn(data.userName, data.password);
    await waitForPaceLoader(page);
    const  calendar = new Calendar(page);
    calendar.searchEmployee(employeeName);
    const rgbValue=calendar.getColorOfCalendarType(leaveType);
    const initialLeaveCount=calendar.getInitalSickLeavesCountForEmployee(employeeName,rgbValue);
    const employeeAvilableDays=calendar.getAvilableDaysCount(employeeName)
    const countOfLeaves=await calendar.selectDaysOff(employeeAvilableDays);
    await calendar.selectCalendarType(leaveType);
    await calendar.validateSickLeavesTakenCount(countOfLeaves,initialLeaveCount,rgbValue);
    await calendar.removeSickDaysApplied(employeeName,rgbValue); 
});

