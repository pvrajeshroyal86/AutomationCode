const {expect } = require('@playwright/test');
const TestUtils = require('../utils/testUtils');
const { generateRandomNumber  } = require('../utils/fakerLibrary');
const testUtils = new TestUtils();
class CreateContractPage {
    constructor(page) {
      this.page = page;
      this.assigneeInput = page.locator('.form-section').nth(0).locator('.SelectItem');
      this.selectEmployee = page.locator('.form-section').nth(0).locator('.SelectItem ul li').first();
      this.contractBasedOnTemplate = page.locator('.form-section').nth(1).locator('.radio-button-list .radio-button-list-item').first();
      this.contractBasedOnPdf=page.locator('.form-section').nth(1).locator('.radio-button-list .radio-button-list-item').nth(1)
      this.continueBtn = page.locator('.blue.button');
      this.templates = page.locator('.table .clickable');
    }
 
    async selectAssignee() {
      await this.assigneeInput.click();
      // const employees=await this.page.locator('.form-section').nth(0).locator('.SelectItem ul li').innerHTML;
      // const count=await employees.count();
      // console.log("Count of employees is "+count);
      const index=generateRandomNumber(1,5);
      console.log("Index is "+index);
      const employeeData=await this.page.locator('.form-section').nth(0).locator('.SelectItem ul li .inline-block.valign-middle').nth(index).innerText();
      const employeeName=this.extractName(employeeData);
      console.log("Employee name is "+employeeName);
      await this.page.locator('.form-section').nth(0).locator('.SelectItem ul li').nth(index).click();
      return employeeName;
    }

    extractName(text) {
      const parenIndex = text.indexOf('(');
      const atIndex = text.indexOf('@');
      if (parenIndex !== -1) return text.slice(0, parenIndex).trim();
      if (atIndex !== -1) return text.slice(0, text.lastIndexOf(' ', atIndex)).trim();
      return text.trim();
    }


    async selectContractType(type) {
      if(type==='template'){
        await this.contractBasedOnTemplate.click();
       }
      else
      {
        await this.contractBasedOnPdf.click();  
      }
    }
  
    async clickContinue() {
      await this.continueBtn.click();
    }
  
    async selectContractTemplate() {
      await this.page.waitForSelector('.table .clickable', { state: 'visible' });
      const elements = await this.page.$$('.table .clickable');  // Using $$ for finding all matching elements
      const count = elements.length;
      const index = count > 5 ? generateRandomNumber(1, 5) : 1;
      console.log('Number of templates avilable:', count);
      console.log("Index is " + index);
      await this.page.locator('div.clickable span').nth(index).waitFor({ state: 'visible' });
      const templateName=await this.page.locator('div.clickable span').nth(index).innerText();
      console.log("Template name is "+templateName);
      await this.page.locator('.table .clickable span').nth(index).click();
  }
  
    async expectUrlToContainContractId() {
      await expect(this.page).toHaveURL(/.*contracts\/[0-9]*/);
    }
  }
  
  module.exports = CreateContractPage;