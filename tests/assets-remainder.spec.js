const { test, expect } = require('@playwright/test');
const AssetPage = require('../pages/assetPage');
const ReusablePage = require('../pages/reusablePage');
const { generateFutureDate, generateVendorName, generateSerialNumber } = require('../library/utils/fakerLibrary');
const data = require('../environment.json');
const { waitForPaceLoader } = require('../library/utils/webUtils');

const CF_ASSET_NAME = `Asset_${generateFutureDate()}`;
const VENDOR = generateVendorName();
const SERIAL = generateSerialNumber();
const REMINDER_DATE = generateFutureDate();

test.describe('Asset Tests', () => {
  let assetPage;
  let personId;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage(); 
    const reusablePage = new ReusablePage(page);
    await page.goto(data.baseUrl + 'calendar');
    personId = await reusablePage.getTotalHoursGreaterThanZero();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    assetPage = new AssetPage(page);
  });

  test('Create a custom field for an asset with a date', async ({ page }) => {
    await page.goto(`${data.baseUrl}/settings/customFields`);
    await assetPage.addNewCustomField(CF_ASSET_NAME);
    await waitForPaceLoader(page);

    // Verify the custom field is created
    await expect(page.locator(`text=${CF_ASSET_NAME}`)).toBeVisible();
  });

  test('Assign asset to employee', async ({ page }) => {
    await page.goto(`${data.baseUrl}/people/${personId}`);
    await assetPage.addNewAsset(VENDOR, SERIAL);
    await waitForPaceLoader(page);

    // Expect the selector count to be greater than zero
    const assetInfoCount = await page.locator('a.AssetInfo span.content .name').count();
    expect(assetInfoCount).toBeGreaterThan(0);
  });

  test('Create reminder for asset', async ({ page }) => {
    await page.goto(`${data.baseUrl}/people/${personId}`);
    await assetPage.createReminderForAsset(REMINDER_DATE);
    await waitForPaceLoader(page);

    // Verify the reminder is created
    await expect(page.locator(`text=${REMINDER_DATE}`)).toBeVisible();    
  });

  test('Verify reminder has been added', async ({ page }) => {
    await page.goto(`${data.baseUrl}reminders`);
    await waitForPaceLoader(page);
    expect(page.locator(`div:nth-child(4) > .text-grey-90 span:has-text("Send date: ${REMINDER_DATE}")`).last()).toBeTruthy();
  });
});