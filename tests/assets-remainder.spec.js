const { test } = require('@playwright/test');
const AssetPage = require('../pages/assetPage');
const { generateFutureDate, generateVendorName, generateSerialNumber } = require('../utils/fakerLibrary');
const data = require('../environment.json');

const PERSON_ID = 21306;
const CF_ASSET_NAME = `Asset_${generateFutureDate()}`;
const VENDOR = generateVendorName();
const SERIAL = generateSerialNumber();
const REMINDER_DATE = generateFutureDate();

test.describe('Asset Tests', () => {
  let assetPage;

  test.beforeEach(async ({ page }) => {
    assetPage = new AssetPage(page);
  });

  test('Create a custom field for an asset with a date', async ({ page }) => {
    await page.goto(`${data.baseUrl}/settings/customFields`);
    await assetPage.addNewCustomField(CF_ASSET_NAME);
  });

  test('Assign asset to employee', async ({ page }) => {
    await page.goto(`${data.baseUrl}/people/${PERSON_ID}`);
    await assetPage.addNewAsset(VENDOR, SERIAL);
  });

  test('Create reminder for asset', async ({ page }) => {
    await page.goto(`${data.baseUrl}/people/${PERSON_ID}`);
    await assetPage.createReminderForAsset(REMINDER_DATE);
  });

  test('Verify reminder has been added', async ({ page }) => {
    await page.goto(`${data.baseUrl}/reminders`);
    await assetPage.verifyReminder(REMINDER_DATE);
  });
});