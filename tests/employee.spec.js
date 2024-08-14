const { test } = require('@playwright/test');
const data = require('../environment.json');
const Login = require('../pages/loginPage');
const CreateEmployeePage = require('../pages/createEmployeePage');
const { generateFirstName, generateLastName, generateEmail } = require('../utils/fakerLibrary');
const { waitForPaceLoader } = require('../utils/webUtils');

test('Create Employee Card', async ({ page }) => {
  const firstName = generateFirstName();
  const lastName = generateLastName();
  const empEmail = generateEmail();

  const login = new Login(page);
  const createEmployeePage = new CreateEmployeePage(page);

  await page.goto(data.baseUrl + 'people/new');
  await login.signIn(data.userName, data.password);
  await waitForPaceLoader(page);
  await createEmployeePage.getPageHeaderAndValidate();
  await createEmployeePage.createNewEmployee(firstName, lastName, empEmail);
  await waitForPaceLoader(page);
  await createEmployeePage.validatePageHeaderAndSelectHRManualEntry();
  await waitForPaceLoader(page);
  const newPersonId = await createEmployeePage.getEmployeeId();
  await createEmployeePage.validateEmployeeCard(firstName, lastName, empEmail);
  await createEmployeePage.navigateToPeopleHomePage();
  await createEmployeePage.validateEmployeeInPeopleList(firstName, lastName, newPersonId);
});