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

  async createSegment(segmentName) {
    await this.page.locator(this.locators.segmentNameInput).fill(segmentName);
    const rule = await this.page.locator(this.locators.ruleFields);
    await rule.locator(this.locators.propertySelect).selectOption('address_country_code');
    await rule.locator(this.locators.valueSelect).selectOption('BE');
    await this.page.locator(this.locators.saveButton).first().click();
    await this.page.waitForTimeout(1000); // wait for 1 second to make sure that the page is loaded
    await expect(this.page).toHaveURL(/.*people$/);
    const createdSegmentName = await this.page.waitForSelector(this.locators.dropdownTarget(segmentName));
    expect(createdSegmentName).not.toBeNull();
  }

  async editSegment(newSegmentName) {
    await this.page.locator(this.locators.segmentNameInput).fill(newSegmentName);
    await this.page.locator(this.locators.saveButton).first().click();
    await this.page.waitForTimeout(1000); // wait for 1 second to make sure that the page is loaded
    await expect(this.page).toHaveURL(/.*people$/);
    const editedSegmentName = await this.page.waitForSelector(this.locators.dropdownTarget(newSegmentName));
    expect(editedSegmentName).not.toBeNull();
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