const {expect } = require('@playwright/test');
const { generateRandomNumber  } = require('../utils/fakerLibrary');
const { waitForPaceLoader } = require('../utils/webUtils');

class CreateContractPage {
    constructor(page) {
      this.page = page;
      this.locators = {
        assigneeInput :page.locator('.form-section').nth(0).locator('.SelectItem'),
        selectEmployee  : page.locator('.form-section').nth(0).locator('.SelectItem ul li').first(),
        contractBasedOnTemplate : page.locator('.form-section').nth(1).locator('.radio-button-list .radio-button-list-item').first(),
        contractBasedOnPdf: page.locator('.form-section').nth(1).locator('.radio-button-list .radio-button-list-item').nth(1),
        continueBtn : page.locator('.blue.button'),
        templates : page.locator('.table .clickable'),
        searchInput : page.locator('.table input[placeholder="search..."]'),
        contractLink : (contractId) => this.page.locator(`a[href="/contracts/${contractId}"]`),
        contractName : (contractId) => this.contractLink(contractId).locator('div.td').first(),
        employeeName : (contractId) => this.contractLink(contractId).locator('div.td').nth(1),
      };
      
    }
 
    async selectAssignee() {
      await this.locators.assigneeInput.click();
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
        await this.locators.contractBasedOnTemplate.click();
       }
      else
      {
        await this.locators.contractBasedOnPdf.click();  
      }
    }
  
    async clickContinue() {
      await this.locators.continueBtn.click();
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
      return templateName;
  }
  
    async expectUrlToContainContractId() {
      const newContractId = this.page.url().split('/').reverse()[0];
      console.log('newContractId ', newContractId);
      await expect(this.page).toHaveURL(/.*contracts\/[0-9]*/);
      return newContractId;
    }

  async verifyContractInTable(contractId,employeeName,contractTemplate)
  {
    await this.locators.searchInput.type(employeeName);
    await this.page.waitForSelector(this.locators.contractLink(contractId));
    expect(this.page.locator(this.locators.contractLink(contractId)).toHaveCount(1));
    await expect(this.locators.contractName(contractId)).toHaveText(contractTemplate);
    await expect(this.locators.employeeName(contractId)).toHaveText(employeeName);
  }
  
}
  module.exports = CreateContractPage;