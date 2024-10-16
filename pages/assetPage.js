const { waitForPaceLoader } = require('../library/utils/webUtils');
const { expect } = require('@playwright/test');

class AssetPage {
  constructor(page) {
    this.page = page;
    this.locators = {
      addNewCustomFieldButton: 'a:has-text("Add new custom field")',
      customFieldNameInput: '.form-field > input',
      objectTypeSelect: '.form-field > .select > select:first-of-type',
      customFieldTypeSelect: '.form-field > .select > select:last-of-type',
      linkReminderCheckbox: 'span:has-text("Link automatic reminder")',
      visibleIfFilledCheckbox: 'span:has-text("Visible if filled in")',
      continueButton: 'span:has-text("Continue")',
      addAssetButton: 'div:has-text("assets") > a',
      assetDropdownInput: 'form > .form > .fields > .field > .SelectItem > input:first-of-type',
      firstDropdownItem: '.list > li > span:first-of-type',
      addAssetConfirmButton: 'button:has-text("Add")',
      vendorInput: '#inputvendor',
      serialNumberInput: '#inputserial_number',
      saveAssetButton: 'button:has-text("save")',
      assetItem: '.box.compact.assets > a > .item > .content > span:has-text("Toegangsbadge"):first-of-type',
      editIcon: '.box-wrap > .box-header > a > .mdi.mdi-pencil',
      reminderDateInput: '[placeholder="dd/mm/yyyy"]',
      saveChangesButton: 'button:has-text("Save changes")'
    };
  }

  async addNewCustomField(name) {
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.addNewCustomFieldButton).click();
    await this.page.locator(this.locators.customFieldNameInput).fill(name);
    await this.page.locator(this.locators.objectTypeSelect).first().selectOption({ label: 'Asset' });
    await this.page.locator(this.locators.customFieldTypeSelect).nth(1).selectOption({ label: 'Date' });
    await this.page.locator(this.locators.linkReminderCheckbox).click();
    await this.page.locator(this.locators.visibleIfFilledCheckbox).click();
    await this.page.locator(this.locators.continueButton).click();
    await waitForPaceLoader(this.page);
  }

  async addNewAsset(vendor, serial) {
    await this.page.locator(this.locators.addAssetButton).click();
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.assetDropdownInput).first().click();
    await this.page.locator(this.locators.firstDropdownItem).first().click();
    await this.page.locator(this.locators.addAssetConfirmButton).click();
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.vendorInput).fill(vendor);
    await this.page.locator(this.locators.serialNumberInput).fill(serial);
    await this.page.locator(this.locators.saveAssetButton).click();
  }

  async createReminderForAsset(reminderDate) {
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.assetItem).first().click();
    await this.page.locator(this.locators.editIcon).click();
    await this.page.locator(this.locators.reminderDateInput).first().fill(reminderDate);
    await this.page.locator(this.locators.saveChangesButton).click();
  }

  async verifyReminder(reminderDate) {
    await waitForPaceLoader(this.page);
    expect(this.page.locator(`div:nth-child(4) > .text-grey-90 span:has-text("Send date: ${reminderDate}")`).last()).toBeTruthy();
  }
}

module.exports = AssetPage;