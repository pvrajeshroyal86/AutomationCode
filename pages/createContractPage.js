const {expect } = require('@playwright/test');
class CreateContractPage {
    constructor(page) {
      this.page = page;
      this.assigneeInput = page.locator('.form-section').nth(0).locator('.SelectItem');
      this.selectEmployee = page.locator('.form-section').nth(0).locator('.SelectItem ul li').first();
      this.contractBasedOnTemplate = page.locator('.form-section').nth(1).locator('.radio-button-list .radio-button-list-item').first();
      this.continueBtn = page.locator('.blue.button');
      this.firstTemplate = page.locator('.table .clickable').first();
    }
  
    async selectAssignee() {
      await this.assigneeInput.click();
      await this.selectEmployee.click();
    }
  
    async selectContractType() {
      await this.contractBasedOnTemplate.click();
    }
  
    async clickContinue() {
      await this.continueBtn.click();
    }
  
    async selectFirstTemplate() {
      await this.firstTemplate.click();
    }
  
    async expectUrlToContainContractId() {
      await expect(this.page).toHaveURL(/.*contracts\/[0-9]*/);
    }
  }
  
  module.exports = CreateContractPage;