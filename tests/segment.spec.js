const { test, expect } = require('@playwright/test');
const { generateSegmentName } = require('../library/utils/fakerLibrary');
const SegmentPage = require('../pages/segmentPage');
const data = require('../environment.json');
const { waitForPaceLoader } = require('../library/utils/webUtils');

const EDITABLE_SEGMENT_ID = 5;
const DELETABLE_SEGMENT_ID = 7;
const EDITABLE_SEGMENT_NEW_NAME = generateSegmentName();
const DELETABLE_SEGMENT_NAME = 'Niet vlees eters';

test.describe('Segment Tests', () => {
  test('it can create a segment', async ({ page }) => {
    const segmentPage = new SegmentPage(page);
    const CREATED_SEGMENT_NAME = generateSegmentName();

    // Navigate to the new segment builder page
    await segmentPage.gotoNewSegmentBuilder();

    // Create a new segment
    await segmentPage.createSegment(CREATED_SEGMENT_NAME);

    // Verify segment is created
    await page.goto(data.baseUrl + 'settings/segments');
    await page.waitForSelector(segmentPage.locators.dropdownTarget(CREATED_SEGMENT_NAME));
    await expect(page.locator(segmentPage.locators.dropdownTarget(CREATED_SEGMENT_NAME))).toBeVisible();
  });

  test('it can edit a segment', async ({ page }) => {
    const segmentPage = new SegmentPage(page);

    // Navigate to the segment builder page for the editable segment
    await segmentPage.gotoSegmentBuilder(EDITABLE_SEGMENT_ID);

    // Edit the segment with a new name
    await segmentPage.editSegment(EDITABLE_SEGMENT_NEW_NAME);

    // Verify segment is edited
    await page.goto(data.baseUrl + 'settings/segments');
    await waitForPaceLoader(page);
    await page.waitForSelector(segmentPage.locators.dropdownTarget(EDITABLE_SEGMENT_NEW_NAME));
    await expect(page.locator(segmentPage.locators.dropdownTarget(EDITABLE_SEGMENT_NEW_NAME))).toBeVisible();
  });

  test('it can delete a segment', async ({ page }) => {
    const segmentPage = new SegmentPage(page);

    // Navigate to the segment builder page for the deletable segment
    await segmentPage.gotoSegmentBuilder(DELETABLE_SEGMENT_ID);

    // Delete the segment
    await segmentPage.deleteSegment();

    // Verify segment is deleted
    await page.goto(data.baseUrl + 'settings/segments');
    await waitForPaceLoader(page);
    await expect(page.locator(segmentPage.locators.dropdownTarget(DELETABLE_SEGMENT_NAME))).not.toBeVisible();
  });
});

test('creating segment for contract module', async ({ page }) => {
  const segmentPage = new SegmentPage(page);
  const CREATED_SEGMENT_NAME = generateSegmentName();
  const segmentRule1 = "contract_name"; // selecting property dropdown option with value attribute
  const segmentValue1 = "GDPR-policy";
  const segmentRule2 = "status";  // selecting property dropdown option with value attribute
  const segmentValue2 = "pending";

  // Navigate to the contract segment builder page
  await page.goto(data.baseUrl + 'settings/segments/builder?object=contracts&back=/contracts');

  // Fill in the segment name
  await segmentPage.fillSegmentName(CREATED_SEGMENT_NAME);

  // Set the first rule for the segment
  await segmentPage.selectPropertyAndTextValue("0", segmentRule1, segmentValue1);

  // Add a new rule for the segment
  await segmentPage.addSegmentRuleButton();

  // Set the second rule for the segment
  await segmentPage.selectPropertyAndDropdownValue("1", segmentRule2, segmentValue2);

  // Save the segment rule
  await segmentPage.saveSegmentRule();

  // Verify segment is created
  await page.goto(data.baseUrl + 'settings/segments');
  await waitForPaceLoader(page);
  await page.waitForSelector(segmentPage.locators.dropdownTarget(CREATED_SEGMENT_NAME));
  await expect(page.locator(segmentPage.locators.dropdownTarget(CREATED_SEGMENT_NAME))).toBeVisible();
});