const data = require('../environment.json');
const { waitForPaceLoader } = require('../library/utils/webUtils');

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
      segmentsTable:(segmentName) => `.tbody .td:has-text("${segmentName}")`,
      deleteButton: '.button.red',
      dropdown: '.page .dropdown',
      FetchRule: '.three.fields',
      addSegmentRuleBtn: '.button:has-text("Add new rule")',
      peopleSegment: '.tbody .td:has-text("People")'
    };
  }

  /**
   * Navigates to the segment builder page for a specific segment ID.
   * @param {number} id - The ID of the segment to edit.
   */
  async gotoSegmentBuilder(id) {
    await this.page.goto(this.locators.segmentBuilderUrl(id));
  }

  /**
   * Navigates to the new segment builder page.
   */
  async gotoNewSegmentBuilder() {
    await this.page.goto(this.locators.newSegmentBuilderUrl);
  }

  /**
   * Fills in the segment name.
   * @param {string} segmentName - The name of the segment.
   */
  async fillSegmentName(segmentName) {
    await this.page.locator(this.locators.segmentNameInput).fill(segmentName);
  }

  /**
   * Sets a rule for the segment.
   * @param {string} property - The property to set.
   * @param {string} value - The value to set for the property.
   */
  async setSegmentRule(property, value) {
    const rule = await this.page.locator(this.locators.ruleFields);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    await rule.locator(this.locators.valueSelectDropdown).selectOption(value);
  }

  /**
   * Saves the segment rule.
   */
  async saveSegmentRule() {
    await this.page.locator(this.locators.saveButton).first().click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Creates a new segment with the specified name.
   * @param {string} segmentName - The name of the segment to create.
   */
  async createSegment(segmentName) {
    await this.fillSegmentName(segmentName);
    await this.setSegmentRule('address_country_code', 'BE');
    await this.saveSegmentRule();
  }

  /**
   * Edits an existing segment with a new name.
   * @param {string} newSegmentName - The new name for the segment.
   */
  async editSegment(newSegmentName) {
    await this.fillSegmentName(newSegmentName);
    await this.saveSegmentRule();
  }

  /**
   * Deletes the current segment.
   */
  async deleteSegment() {
    this.page.on('dialog', dialog => dialog.accept());
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.deleteButton).click();    
  }

  /**
   * Selects a rule number to add.
   * @param {number} ruleNumber - The rule number to select.
   * @returns {Locator} The locator for the selected rule.
   */
  async selectRuleNumberToAdd(ruleNumber) {
    const rule = await this.page.locator(this.locators.FetchRule).nth(ruleNumber);
    return rule;
  }

  /**
   * Selects a property and text value for a rule.
   * @param {number} ruleNo - The rule number.
   * @param {string} property - The property to set.
   * @param {string} value - The value to set for the property.
   */
  async selectPropertyAndTextValue(ruleNo, property, value) {
    const rule = await this.selectRuleNumberToAdd(ruleNo);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    await rule.locator(this.locators.valueTextField).fill(value);
  }

  /**
   * Selects a property and dropdown value for a rule.
   * @param {number} ruleNo - The rule number.
   * @param {string} property - The property to set.
   * @param {string} value - The value to set for the property.
   */
  async selectPropertyAndDropdownValue(ruleNo, property, value) {
    const rule = await this.selectRuleNumberToAdd(ruleNo);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    await rule.locator(this.locators.valueSelectDropdown).selectOption(value);
  }

  /**
   * Selects a property, condition, and value for a rule.
   * @param {number} ruleNo - The rule number.
   * @param {string} property - The property to set.
   * @param {string} condition - The condition to set.
   * @param {string} value - The value to set for the property.
   */
  async selectSePropertyCondionValue(ruleNo, property, condition, value) {
    const rule = await this.selectRuleNumberToAdd(ruleNo);
    await rule.locator(this.locators.propertySelect).selectOption(property);
    await rule.locator(this.locators.ruleCondition).selectOption(condition);
    await rule.locator(this.locators.valueSelect).selectOption(value);
  }

  /**
   * Clicks the button to add a new segment rule.
   */
  async addSegmentRuleButton() {
    await this.page.locator(this.locators.addSegmentRuleBtn).click();
  }

  /**
   * Opens the segment to edit.
   */
  async openSegmentToEdit()
  {

  }
}

module.exports = SegmentPage;