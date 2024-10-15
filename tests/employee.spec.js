const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const CreateEmployeePage = require('../pages/createEmployeePage');
const { generateFirstName, generateLastName, generateEmail } = require('../library/utils/fakerLibrary');
const { waitForPaceLoader } = require('../library/utils/webUtils');

test('Create Employee Card', async ({ page }) => {
  const firstName = generateFirstName();
  const lastName = generateLastName();
  const empEmail = generateEmail();

  const createEmployeePage = new CreateEmployeePage(page);

  // Navigate to the new employee creation page
  await page.goto(data.baseUrl + 'people/new');
  await waitForPaceLoader(page);

  // Validate the page header
  await createEmployeePage.getPageHeaderAndValidate();

  // Create a new employee
  await createEmployeePage.createNewEmployee(firstName, lastName, empEmail);
  await waitForPaceLoader(page);

  // Validate the page header and select HR manual entry
  await createEmployeePage.validatePageHeaderAndSelectHRManualEntry();
  await waitForPaceLoader(page);

  // Get the new employee ID
  const newPersonId = await createEmployeePage.getEmployeeId();
  console.log('New Person ID: ' + newPersonId);

  // Validate the employee card details
  await expect(page.locator('.person-header .details .name')).toContainText(`${firstName} ${lastName}`);
  await expect(page.locator(`a:text("${empEmail}")`)).toHaveCount(1);
  await expect(page.locator('.box.box-yellow')).toHaveCount(1);

  // Navigate to the people home page
  await createEmployeePage.navigateToPeopleHomePage();

  // Validate the employee in the people list
  await expect(page.locator('.table.list.boxxed a.tr:first-of-type .flex > span')).toContainText(`${firstName} ${lastName}`);
  await expect(page.locator(`.table.list.boxxed a.tr:first-of-type[href="/people/${newPersonId}"]`)).toHaveCount(1);
});