const { test } = require('@playwright/test');
const AssetPage = require('../pages/assetPage');
const ReusablePage = require('../pages/reusablePage');
const { generateFutureDate, generateVendorName, generateSerialNumber } = require('../library/utils/fakerLibrary');
const data = require('../environment.json');

const CF_ASSET_NAME = `Asset_${generateFutureDate()}`;
const VENDOR = generateVendorName();
const SERIAL = generateSerialNumber();
const REMINDER_DATE = generateFutureDate();

test.describe('Asset Tests', () => {
  let assetPage;
  let personId;

  test.beforeAll(async ({ browser }) => {
    let page;
    page = await browser.newPage(); 
    const reusablePage = new ReusablePage(page);
    await page.goto(data.baseUrl + 'calendar');
    personId = await reusablePage.getTotalHoursGreaterThanZero();
    page.close();
  });

  test.beforeEach(async ({ page }) => {
    assetPage = new AssetPage(page);
  });

  test('Create a custom field for an asset with a date', async ({ page }) => {
    await page.goto(`${data.baseUrl}/settings/customFields`);
    await assetPage.addNewCustomField(CF_ASSET_NAME);
  });

  test('Assign asset to employee', async ({ page }) => {
    await page.goto(`${data.baseUrl}/people/${personId}`);
    await assetPage.addNewAsset(VENDOR, SERIAL);
  });

  test('Create reminder for asset', async ({ page }) => {
    await page.goto(`${data.baseUrl}/people/${personId}`);
    await assetPage.createReminderForAsset(REMINDER_DATE);
  });

  test('Verify reminder has been added', async ({ page }) => {
    await page.goto(`${data.baseUrl}reminders`);
    await assetPage.verifyReminder(REMINDER_DATE);
  });
});