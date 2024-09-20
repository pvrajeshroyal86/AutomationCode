const { expect } = require('@playwright/test');
const data = require('../environment.json');

class SegmentPage {
  constructor(page) {
    this.page = page;
    this.locators = {
      segmentBuilderUrl: (id) => data.baseUrl + `settings/segments/builder?id=${id}&object=people&back=/people`,
      newSegmentBuilderUrl: data.baseUrl + 'settings/segments/builder?object=people&back=/people',
      segmentNameInput: 'input[id="name"]',
      ruleFields: '.three.fields',
      propertySelect: '.field:nth-child(1) select',
      valueSelect: '.field:nth-child(3) select',
      saveButton: '.button:has-text("Save")',
      dropdownTarget: (segmentName) => `#dropdown-target:has-text("${segmentName}")`,
      deleteButton: '.button.red',
      dropdown: '.page .dropdown'
    };
  }

  async gotoSegmentBuilder(id) {
    await this.page.goto(this.locators.segmentBuilderUrl(id));
  }

  async gotoNewSegmentBuilder() {
    await this.page.goto(this.locators.newSegmentBuilderUrl);
  }

  async fillSegmentName(segmentName) {
    await this.page.locator(this.locators.segmentNameInput).fill(segmentName);
  }

  async setSegmentRule(property, value) {
    const rule = await this.page.locator(this.locators.ruleFields);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    await rule.locator(this.locators.valueSelect).selectOption(value);
  }

  async saveSegment() {
    await this.page.locator(this.locators.saveButton).first().click();
    await this.page.waitForTimeout(1000); // wait for 1 second to make sure that the page is loaded
    await expect(this.page).toHaveURL(/.*people$/);
  }

  async verifySegmentInDropdown(segmentName) {
    const segment = await this.page.waitForSelector(this.locators.dropdownTarget(segmentName));
    expect(segment).not.toBeNull();
  }

  async createSegment(segmentName) {
    await this.fillSegmentName(segmentName);
    await this.setSegmentRule('address_country_code', 'BE');
    await this.saveSegment();
    await this.verifySegmentInDropdown(segmentName);
  }

  async editSegment(newSegmentName) {
    await this.fillSegmentName(newSegmentName);
    await this.saveSegment();
    await this.verifySegmentInDropdown(newSegmentName);
  }

  async deleteSegment(segmentName) {
    this.page.on('dialog', dialog => dialog.accept());
    await this.page.locator(this.locators.deleteButton).click();
    await expect(this.page).toHaveURL(/.*people$/);
    const dropdownText = await this.page.locator(this.locators.dropdown).first().innerText();
    expect(dropdownText).not.toContain(segmentName);
  }
}

module.exports = SegmentPage;