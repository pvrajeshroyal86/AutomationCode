const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const Login = require('../pages/loginPage');
const { faker } = require('@faker-js/faker');
const Calendar = require('../pages/calendarPage');   
const { waitForPaceLoader } = require('../utils/webUtils');
 
test('Apply Sick Leave', async ({ page }) => {
    const login = new Login(page);
    await page.goto(data.baseUrl + 'calendar');
    await login.signIn(data.userName, data.password);
    await waitForPaceLoader(page);
    const  calendar = new Calendar(page);
    const employeeAvilableDays=calendar.searchEmployeeAndGetavilableDaysCount('Carla Kleermaekers');
    await calendar.selectDaysOff(employeeAvilableDays);
});

