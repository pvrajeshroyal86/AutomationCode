const { expect } = require('@playwright/test');
const data = require('../environment.json');
const { waitForPaceLoader } = require('../utils/webUtils');

class SegmentPage {
  constructor(page) {
    this.page = page;
    this.locators = {
      segmentBuilderUrl: (id) => data.baseUrl + `settings/segments/builder?id=${id}&object=people&back=/people`,
      newSegmentBuilderUrl: data.baseUrl + 'settings/segments/builder?object=people&back=/people',
      segmentNameInput: 'input[id="name"]',
      ruleFields: '.three.fields',
      propertySelect: '.field:nth-child(1) select',
      ruleCondition: '.field:nth-child(2) select',
      valueSelectDropdown: '.field:nth-child(3) select',
      valueTextField: '.field:nth-child(3) input',
      saveButton: '.button:has-text("Save")',
      dropdownTarget: (segmentName) => `#dropdown-target:has-text("${segmentName}")`,
      deleteButton: '.button.red',
      dropdown: '.page .dropdown',
      FetchRule:'.three.fields',
      addSegmentRuleBtn: '.button:has-text("Add new rule")',
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

  async saveSegmentRuleAndVerifyUrl(segmentModule) {
    await this.page.locator(this.locators.saveButton).first().click();
    await waitForPaceLoader(this.page);  // wait for 1 second to make sure that the page is loaded
    switch (segmentModule) {
      case 'people':
        await expect(this.page).toHaveURL(/.*people$/);
        break;
      case 'contracts':
        await expect(this.page).toHaveURL(/.*contracts$/);
        break;
      default:
        console.error('Invalid segment module');
    }
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

  async selectRuleNumberToAdd(ruleNumber) {
    const rule = await this.page.locator(this.locators.FetchRule).nth(ruleNumber);
    return rule;
  }

  async selectPropertyAndTextValue(ruleNo, property,value) {
    const rule=await this.selectRuleNumberToAdd(ruleNo);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    // const valueSelectExists = await rule.locator(this.locators.valueSelect).count();
    // if (valueSelectExists > 0) { // If valueSelect exists, select the option
    //     await rule.locator(this.locators.valueSelect).selectOption(value);
    // } else {  // If valueSelect does not exist, fallback to valueTextField and fill the value
    //    
    await rule.locator(this.locators.valueTextField).fill(value);
    //}
  }

  async selectPropertyAndDropdownValue(ruleNo, property,value) {
    const rule=await this.selectRuleNumberToAdd(ruleNo);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    await rule.locator(this.locators.valueSelectDropdown).selectOption(value);
  }

  async selectSePropertyCondionValue(ruleNo, property, condition, value) {
    const rule=await this.selectRuleNumberToAdd(ruleNo);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    await rule.locator(this.locators.ruleCondition).selectOption(condition);
    await rule.locator(this.locators.valueSelect).selectOption(value);
  }

  async addSegmentRuleButton() {
    await this.page.locator(this.locators.addSegmentRuleBtn).click();
  }

}

module.exports = SegmentPage;