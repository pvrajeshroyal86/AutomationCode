const { test } = require('@playwright/test');
const data = require('../environment.json');
const ReminderPage = require('../pages/ReminderPage');
const { generateFutureDate, generateVendorName } = require('../utils/fakerLibrary');

const PERSON_ID = 21508;
const NEW_REMINDER_DESCRIPTION = `Reminder_${generateVendorName()}`;
const NEW_REMINDER_DATE = generateFutureDate();
const EDITABLE_EDITED_REMINDER_DESCRIPTION = `Edited_${generateVendorName()}`

test.describe('Reminder Tests', () => {
  test('it can create a reminder', async ({ page }) => {
    const reminderPage = new ReminderPage(page);
    await page.goto(`${data.baseUrl}/reminders/employee/${PERSON_ID}?relatedEmployeeId=${PERSON_ID}`);
    await reminderPage.createReminder(NEW_REMINDER_DATE, NEW_REMINDER_DESCRIPTION);
    await reminderPage.validateReminderExists(NEW_REMINDER_DATE, NEW_REMINDER_DESCRIPTION);
  });

  test('it can edit a reminder', async ({ page }) => {
    const reminderPage = new ReminderPage(page);
    await page.goto(`${data.baseUrl}/reminders/employee/${PERSON_ID}?relatedEmployeeId=${PERSON_ID}`);
    await reminderPage.editReminder(NEW_REMINDER_DESCRIPTION, EDITABLE_EDITED_REMINDER_DESCRIPTION);
    await reminderPage.validateReminderExists('', EDITABLE_EDITED_REMINDER_DESCRIPTION);
  });

  test('it can remove a reminder', async ({ page }) => {
    const reminderPage = new ReminderPage(page);
    await page.goto(`${data.baseUrl}/reminders/employee/${PERSON_ID}?relatedEmployeeId=${PERSON_ID}`);
    await reminderPage.deleteReminder(EDITABLE_EDITED_REMINDER_DESCRIPTION);
    await reminderPage.validateReminderNotExists(EDITABLE_EDITED_REMINDER_DESCRIPTION);
  });
});