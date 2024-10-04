const { waitForPaceLoader } = require('../utils/webUtils');
const { expect } = require('@playwright/test');

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

  async createReminder(date, description) {
    await this.page.locator(this.locators.newReminderButton).click();
    await this.page.locator(this.locators.dateInput).fill(date);
    await this.page.keyboard.press('Escape');
    await this.page.locator(this.locators.descriptionInput).fill(description);
    await this.page.locator(this.locators.saveButton).click();
    await waitForPaceLoader(this.page);
  }

  async editReminder(oldDescription, newDescription) {
    await waitForPaceLoader(this.page);
    await this.page.locator(`.tr:has-text("${oldDescription}") ${this.locators.dropdown}`).click();
    await this.page.locator(`.tr:has-text("${oldDescription}") ${this.locators.editOption}`).click();
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.descriptionInput).fill(newDescription);
    await this.page.locator(this.locators.saveButton).click();
    await waitForPaceLoader(this.page);
  }

  async deleteReminder(description) {
    await waitForPaceLoader(this.page);
    await this.page.locator(`.tr:has-text("${description}") ${this.locators.dropdown}`).click();
    await this.page.locator(`.tr:has-text("${description}") ${this.locators.deleteOption}`).click();
    await this.page.locator(this.locators.confirmButton).click();
    await waitForPaceLoader(this.page);
  }

  async validateReminderExists(date, description) {
    const tableText = await this.page.locator(this.locators.table).innerText();
    expect(tableText).toContain(date);
    expect(tableText).toContain(description);
  }

  async validateReminderNotExists(description) {
    const tableText = await this.page.locator(this.locators.table).innerText();
    expect(tableText).not.toContain(description);
  }
}

module.exports = ReminderPage;