const {expect } = require('@playwright/test');
const data = require('../environment.json');
const { generateRandomNumber  } = require('../utils/fakerLibrary');
const { waitForPaceLoader ,waitForElementToDisappear} = require('../utils/webUtils');

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
        contractLink : (contractId) => `a[href="/contracts/${contractId}"]`,
        contractDetail : (contractId) => `a[href="/contracts/${contractId}"] .td`,
        selectSignature:`.radio-button-list .radio-button-list-item`,
        contractTitle: `.form input`,
        uploadButton: `input#pdfUploadInput`,
        contractsTable:`.table .clickable`,
        actionsDropdown: '.page .dropdown',
        actionsEditOption:`.dropdown span:has-text("Edit contract")`,
        actionsDownloadOption:`.dropdown span:has-text("Download PDF")`,
        actionsArchiveOption:`.dropdown span:has-text("Archive")`,
        archiveConfirmBtn:`button:has-text("Confirm")`,
        archiveMessageBox:`.box-red`,
        unarchiveBtn:`.button:has-text("Unarchive")`,
        unarchiveConfirmBtn:`.modal-content .blue.button`,
        editor :page.frameLocator('[src="/ckeditor/editor.html"]').frameLocator('.cke_wysiwyg_frame').locator('body'),
        contractEntirePage:`#SignPage`,
        contractSaveBtn:`.blue.button`,
        deletePermanentlyBtn:`.button:has-text("Delete permanently")`,
        checkBoxForDelete:`span:has-text("Yes, I want to permanently delete this contract")`,
        deletePermantlyCOnfirmBtn:`.modal-content .button:has-text("Delete permanently")`,
        signContractBtn:`.button:has-text("Sign contract")`,
        yourNameField:`[placeholder="Enter your full name"]`,
        signBtn:`.popup .button:has-text("Sign")`,
        signaturePopUp:`.popup`,  
        signatureStatus:`.status-tag`
      };
      
    }
 
    async selectAssignee() {
      await this.locators.assigneeInput.click();
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
      await waitForPaceLoader(this.page);
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
      await waitForPaceLoader(this.page);
      await expect(this.page).toHaveURL(/.*contracts\/[0-9]*/);
      await waitForPaceLoader(this.page);
      const newContractId = await this.page.url().split('/').reverse()[0];
      console.log('newContractId ', newContractId);
      return newContractId;
    }

  async verifyContractInTable(contractId,employeeName,contractTemplate)
  {
    await this.locators.searchInput.type(employeeName);
    await waitForPaceLoader(this.page);
    await expect(this.page.locator(this.locators.contractLink(contractId))).toHaveCount(1);
    await expect(this.page.locator(this.locators.contractDetail(contractId)).first()).toContainText(contractTemplate);
    await expect(this.page.locator(this.locators.contractDetail(contractId)).nth(1)).toContainText(employeeName);
  }

  async selectWhoShouldSignOnContract(option) 
  {
      switch(option) {  
        case 'employee_Employer_Sign':
          await this.page.locator(this.locators.selectSignature).nth(0).click();
          break;
        case 'employee_Sign':
          await this.page.locator(this.locators.selectSignature).nth(1).click();
          break;
        case 'nobody':
          await this.page.locator(this.locators.selectSignature).nth(2).click();
          break;
        default:
          throw new Error('Invalid option');
    }
  }

  async fillContractTitle(title) {
    await waitForPaceLoader(this.page);
    await this.page.locator(this.locators.contractTitle).fill(title);
  }

    async uploadPdfDocument(filePath) { 
      await this.page.setInputFiles(this.locators.uploadButton, filePath);
      await waitForPaceLoader(this.page); 
    }

    async checkExistingContractOrCreate()
    {
      const contracts = await this.page.$$(this.locators.contractsTable);  // Using $$ for finding all matching elements
      const count = contracts.length;
      console.log('Number of contracts avilable:', count);
      if(count>1)
      {
        console.log('Existing contract found and count is ', count);
        const index = count > 5 ? generateRandomNumber(1, 5) : 1;
        const contractId=(await this.page.locator(this.locators.contractsTable).nth(index).getAttribute('href')).match(/\/contracts\/(\d+)/)[1];
        console.log('contractId ', contractId);
        return contractId;
      }
      else
      { 
          await page.goto(data.baseUrl + 'contracts/new');
          await waitForPaceLoader(this.page);
          await this.selectAssignee();
          this.selectContractType('template');
          this.clickContinue();
          await this.selectContractTemplate();
          this.clickContinue();
          await this.expectUrlToContainContractId();
      }
    }

       async selectContractEditOption()
      {
        await this.page.locator(this.locators.actionsDropdown).click();
        await this.page.locator(this.locators.actionsEditOption).click();
        await waitForPaceLoader(this.page);
      }

      async selectContractDownloadOption()
      {
        await this.page.locator(this.locators.actionsDropdown).click();
        await this.page.locator(this.locators.actionsDownloadOption).click();
      }

      async selectContractArchiveOptionAndConfirm()
      {
        await this.page.locator(this.locators.actionsDropdown).click();
        await this.page.locator(this.locators.actionsArchiveOption).click();
        await waitForPaceLoader(this.page);
        await this.page.locator(this.locators.archiveConfirmBtn).click();
        await waitForPaceLoader(this.page);
      }

      async verifyArchiveMessage()
      {
        expect(await this.page.locator(this.locators.archiveMessageBox).innerText()).toContain('This contract has been archived');
      }

      async performUnarchive() {
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        await this.page.locator(this.locators.unarchiveBtn).click();
        await this.page.locator(this.locators.unarchiveConfirmBtn).click();
        await waitForElementToDisappear(this.page, this.locators.unarchiveBtn);
      }

      async editContractContentAndSave(textToadd)
      {
        await this.locators.editor.click();
        await this.locators.editor.fill(textToadd);
        await this.clickOnSaveBtn();
        await waitForPaceLoader(this.page);
      }

      async verifyUpdatedContractContent(textToadd) {
        expect(await this.page.locator(this.locators.contractEntirePage).innerText()).toContain(textToadd);
    }

    async clickOnSaveBtn() {
      await this.page.locator(this.locators.contractSaveBtn).first().click();
      await waitForPaceLoader(this.page);
  }

  async performPermanentDeleteForContract()
  {
    await this.page.locator(this.locators.deletePermanentlyBtn).click();
    await this.page.locator(this.locators.checkBoxForDelete).click();
    await this.page.locator(this.locators.deletePermantlyCOnfirmBtn).click();
    await waitForPaceLoader(this.page); 
  }

  async verifyUrlAfterCOntractDeletion(contractId)
  {
     await expect(this.page).toHaveURL(/.*contracts$/);
     await this.page.goto(data.baseUrl+`contracts/${contractId}`);
     expect(await this.page.locator('#toast .description').innerText()).toContain('Contract not found or you have no access.')
  }

  async performEmployeerSignatureAndVerifyStatus(EmployeerName)
  {
    await this.page.locator(this.locators.signContractBtn).click();
    await this.page.locator(this.locators.yourNameField).fill(EmployeerName);
    await this.page.locator(this.locators.signBtn).click();
    await waitForElementToDisappear(this.page,this.locators.signaturePopUp);
    const tag = await this.page.locator(this.locators.signatureStatus);
    expect(await tag.innerText()).toContain('Signed');
  }
}

  module.exports = CreateContractPage;