const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const ReminderPage = require('../pages/reminderPage');
const { generateFutureDate, generateVendorName } = require('../library/utils/fakerLibrary');

const PERSON_ID = 21508;
const NEW_REMINDER_DESCRIPTION = `Reminder_${generateVendorName()}`;
const NEW_REMINDER_DATE = generateFutureDate();
const EDITABLE_EDITED_REMINDER_DESCRIPTION = `Edited_${generateVendorName()}`;

test.describe('Reminder Tests', () => {
  test('it can create a reminder', async ({ page }) => {
    const reminderPage = new ReminderPage(page);

    // Navigate to the reminders page for the specific employee
    await page.goto(`${data.baseUrl}/reminders/employee/${PERSON_ID}?relatedEmployeeId=${PERSON_ID}`);

    // Create a new reminder
    await reminderPage.createReminder(NEW_REMINDER_DATE, NEW_REMINDER_DESCRIPTION);

    // Validate the reminder exists
    const tableText = await reminderPage.getReminderDetails();
    expect(tableText).toContain(NEW_REMINDER_DATE);
    expect(tableText).toContain(NEW_REMINDER_DESCRIPTION);
  });

  test('it can edit a reminder', async ({ page }) => {
    const reminderPage = new ReminderPage(page);

    // Navigate to the reminders page for the specific employee
    await page.goto(`${data.baseUrl}/reminders/employee/${PERSON_ID}?relatedEmployeeId=${PERSON_ID}`);

    // Edit the reminder
    await reminderPage.editReminder(NEW_REMINDER_DESCRIPTION, EDITABLE_EDITED_REMINDER_DESCRIPTION);

    // Validate the reminder is edited
    const tableText = await reminderPage.getReminderDetails();
    expect(tableText).toContain(EDITABLE_EDITED_REMINDER_DESCRIPTION);
  });

  test('it can remove a reminder', async ({ page }) => {
    const reminderPage = new ReminderPage(page);

    // Navigate to the reminders page for the specific employee
    await page.goto(`${data.baseUrl}/reminders/employee/${PERSON_ID}?relatedEmployeeId=${PERSON_ID}`);

    // Delete the reminder
    await reminderPage.deleteReminder(EDITABLE_EDITED_REMINDER_DESCRIPTION);

    // Validate the reminder is deleted
    const tableText = await reminderPage.getReminderDetails();
    expect(tableText).not.toContain(EDITABLE_EDITED_REMINDER_DESCRIPTION);
  });
});