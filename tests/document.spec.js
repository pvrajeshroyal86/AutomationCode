const { test, expect } = require('@playwright/test');
const { waitForPaceLoader } = require('../library/utils/webUtils');
const data = require('../environment.json');
const DocumentPage = require('../pages/documentPage');
const { generateFolderName, generateDefaultFolderName } = require('../library/utils/fakerLibrary');

const EMPTY_PERSON_ID = 21508;
const NEW_EMPLOYEE_FOLDER_NAME = generateFolderName();
const RENAMED_EMPLOYEE_FOLDER_NAME = generateFolderName();
const DEFAULT_FOLDER_NAME = generateDefaultFolderName();
const RENAMED_DEFAULT_FOLDER_NAME = generateDefaultFolderName();

test.describe('Document Tests', () => {
  test('add document to employee', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    await page.goto(data.baseUrl + `employee/${EMPTY_PERSON_ID}/documents`);

    await documentPage.uploadDocument('./fileManager/Payslip.pdf');
    await documentPage.selectFirstFolder();
    await documentPage.saveDocument();

    await expect(page).toHaveURL(/.*employee\/[0-9]*\/documents\/[0-9]*/);
    await expect(await page.locator('h1').innerText()).toContain('Payslip.pdf');
  });

  test('add folder to employee', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    await page.goto(data.baseUrl + `employee/${EMPTY_PERSON_ID}/documents`);

    await documentPage.createFolder(NEW_EMPLOYEE_FOLDER_NAME);
    await documentPage.openFolder(NEW_EMPLOYEE_FOLDER_NAME);

    expect(await page.locator('.table').innerText()).toContain('No documents to display');
  });

  test('rename folder from employee', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    await page.goto(data.baseUrl + `employee/${EMPTY_PERSON_ID}/documents`);

    await documentPage.renameFolder(NEW_EMPLOYEE_FOLDER_NAME, RENAMED_EMPLOYEE_FOLDER_NAME);

    expect(await page.locator('.table').innerText()).toContain(RENAMED_EMPLOYEE_FOLDER_NAME);
  });

  test('remove employee folder', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    await page.goto(data.baseUrl + `employee/${EMPTY_PERSON_ID}/documents`);

    await documentPage.removeFolder(RENAMED_EMPLOYEE_FOLDER_NAME);

    expect(await page.locator('.page').innerText()).not.toContain(RENAMED_EMPLOYEE_FOLDER_NAME);
  });

  test('add default folder', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    await page.goto(data.baseUrl + 'settings/defaultFolders');

    await documentPage.addDefaultFolder(DEFAULT_FOLDER_NAME);

    await page.goto(data.baseUrl + `employee/${EMPTY_PERSON_ID}/documents`);
    await waitForPaceLoader(page);

    expect(await page.locator('.table').innerText()).toContain(DEFAULT_FOLDER_NAME);
  });

  test('rename default folder', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    await page.goto(data.baseUrl + 'settings/defaultFolders');

    await documentPage.renameDefaultFolder(DEFAULT_FOLDER_NAME, RENAMED_DEFAULT_FOLDER_NAME);

    await page.goto(data.baseUrl + `employee/${EMPTY_PERSON_ID}/documents`);
    await waitForPaceLoader(page);

    expect(await page.locator('.table').innerText()).toContain(RENAMED_DEFAULT_FOLDER_NAME);
  });

  test('remove default folder', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    await page.goto(data.baseUrl + 'settings/defaultFolders');

    await documentPage.removeDefaultFolder(RENAMED_DEFAULT_FOLDER_NAME);

    await page.goto(data.baseUrl + `employee/${EMPTY_PERSON_ID}/documents`);
    await waitForPaceLoader(page);

    expect(await page.locator('.table').innerText()).not.toContain(RENAMED_DEFAULT_FOLDER_NAME);
  });
});