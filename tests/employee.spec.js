const { test } = require('@playwright/test');
const data = require('../environment.json');
const CreateEmployeePage = require('../pages/createEmployeePage');
const { generateFirstName, generateLastName, generateEmail } = require('../utils/fakerLibrary');
const { waitForPaceLoader } = require('../utils/webUtils');

test('Create Employee Card', async ({ page }) => {
  const firstName = generateFirstName();
  const lastName = generateLastName();
  const empEmail = generateEmail();

  const createEmployeePage = new CreateEmployeePage(page);

  await page.goto(data.baseUrl + 'people/new');
  await waitForPaceLoader(page);
  await createEmployeePage.getPageHeaderAndValidate();
  await createEmployeePage.createNewEmployee(firstName, lastName, empEmail);
  await waitForPaceLoader(page);
  await createEmployeePage.validatePageHeaderAndSelectHRManualEntry();
  await waitForPaceLoader(page);
  const newPersonId =  createEmployeePage.getEmployeeId();
  await createEmployeePage.validateEmployeeCard(firstName, lastName, empEmail);
  await createEmployeePage.navigateToPeopleHomePage();
  await createEmployeePage.validateEmployeeInPeopleList(firstName, lastName, newPersonId);
});