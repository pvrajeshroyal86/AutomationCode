const { test } = require('@playwright/test');
const { generateSegmentName } = require('../utils/fakerLibrary');
const SegmentPage = require('../pages/segmentPage');
const data = require('../environment.json');

const EDITABLE_SEGMENT_ID = 5;
const DELETABLE_SEGMENT_ID = 7;
const EDITABLE_SEGMENT_NEW_NAME = generateSegmentName();
const DELETABLE_SEGMENT_NAME = 'Niet vlees eters';

test.describe('Segment Tests', () => {
  test('it can create a segment', async ({ page }) => {
    const segmentPage = new SegmentPage(page);
    const CREATED_SEGMENT_NAME = generateSegmentName();
    await segmentPage.gotoNewSegmentBuilder();
    await segmentPage.createSegment(CREATED_SEGMENT_NAME);
  });

  test('it can edit a segment', async ({ page }) => {
    const segmentPage = new SegmentPage(page);
    await segmentPage.gotoSegmentBuilder(EDITABLE_SEGMENT_ID);
    await segmentPage.editSegment(EDITABLE_SEGMENT_NEW_NAME);
  });

  test('it can delete a segment', async ({ page }) => {
    const segmentPage = new SegmentPage(page);
    await segmentPage.gotoSegmentBuilder(DELETABLE_SEGMENT_ID);
    await segmentPage.deleteSegment(DELETABLE_SEGMENT_NAME);
  });
});

test('creating segement for contract module', async ({ page }) => {
  const segmentPage = new SegmentPage(page);
  const CREATED_SEGMENT_NAME = generateSegmentName();
  const segmentRule1="contract_name"; // selecting property dropdown option with value attribute
  const segmentValue1="GDPR-policy";  
  const segmentRule2="status";  // selecting property dropdown option with value attribute
  const segmentValue2="pending";

  await page.goto(data.baseUrl+'settings/segments/builder?object=contracts&back=/contracts');
  await segmentPage.fillSegmentName(CREATED_SEGMENT_NAME);                                                   
  await segmentPage.selectPropertyAndTextValue("0",segmentRule1,segmentValue1);     // First Rule=0, Second Rule = 1
  await segmentPage.addSegmentRuleButton();
  const secondRule=segmentPage.selectRuleNumberToAdd(1);  
  await segmentPage.selectPropertyAndDropdownValue("1",segmentRule2,segmentValue2);
  await segmentPage.saveSegmentRuleAndVerifyUrl('contracts');
  await segmentPage.verifySegmentInDropdown(CREATED_SEGMENT_NAME);
});
