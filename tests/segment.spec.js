const { test } = require('@playwright/test');
const { generateSegmentName } = require('../utils/fakerLibrary');
const SegmentPage = require('../pages/segmentPage');

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