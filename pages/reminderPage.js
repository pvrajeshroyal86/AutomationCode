const { waitForPaceLoader } = require('../library/utils/webUtils');

class ReminderPage {
  constructor(page) {
    this.page = page;
    this.locators = {
      newReminderButton: 'a:has-text("New reminder")',
      dateInput: 'input[placeholder="dd/mm/yyyy"]',
      descriptionInput: 'input[placeholder="Replace tires, medical checkup..."]',
      saveButton: '.button:has-text("Save")',
      table: '.table',
      dropdown: '.dropdown',
      editOption: 'a:has-text("Edit")',
      deleteOption: 'a:has-text("Delete")',
      confirmButton: '.modal-content .button:has-text("Confirm")'
    };
  }

  /**
   * Creates a new reminder with the provided date and description.
   * @param {string} date - The date of the reminder.
   * @param {string} description - The description of the reminder.
   */
  async createReminder(date, description) {
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.newReminderButton).click();
    await this.page.locator(this.locators.dateInput).fill(date);
    await this.page.keyboard.press('Escape');
    await this.page.locator(this.locators.descriptionInput).fill(description);
    await this.page.locator(this.locators.saveButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Edits an existing reminder with a new description.
   * @param {string} oldDescription - The old description of the reminder.
   * @param {string} newDescription - The new description of the reminder.
   */
  async editReminder(oldDescription, newDescription) {
    await waitForPaceLoader(this.page);
    await this.page.locator(`.tr:has-text("${oldDescription}") ${this.locators.dropdown}`).click();
    await this.page.locator(`.tr:has-text("${oldDescription}") ${this.locators.editOption}`).click();
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.descriptionInput).fill(newDescription);
    await this.page.locator(this.locators.saveButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Deletes a reminder with the provided description.
   * @param {string} description - The description of the reminder to delete.
   */
  async deleteReminder(description) {
    await waitForPaceLoader(this.page);
    await this.page.locator(`.tr:has-text("${description}") ${this.locators.dropdown}`).click();
    await this.page.locator(`.tr:has-text("${description}") ${this.locators.deleteOption}`).click();
    await this.page.locator(this.locators.confirmButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Validates that a reminder exists with the provided date and description.
   * @returns {Promise<string>} The table text containing the reminder details.
   */
  async getReminderDetails() {
    const tableText = await this.page.locator(this.locators.table).innerText();
    return tableText;
  }
}

module.exports = ReminderPage;