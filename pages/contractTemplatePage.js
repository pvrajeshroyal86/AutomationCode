const {expect } = require('@playwright/test');

class ContractTemplatePage {
    constructor(page) {
        this.page = page;
        this.contractTypeDropdown =page.locator('form [name="type"]');
        this.contractName = page.locator('form [id="name"]');
        this.continueBtn = page.locator('button:has-text("Continue")');
        this.blankTemplateOption = page.locator('a[href^="/settings/contracts/templates/"]'); 
        this.editorWindow=page.frameLocator('[src="/ckeditor/editor.html"]').frameLocator('.cke_wysiwyg_frame').locator('body');  
        this.saveBtn = page.locator('.blue.button').first();
        this.contractTable = page.locator('.page .table');
        this.blankContractTemplate = page.locator('a[href^="/settings/contracts/templates/"]');
        this.wordDocumentTemplate = page.locator('input#fileUpload');
    }

    async uploadWordDocument(filePath){
      await this.page.setInputFiles('input#fileUpload', filePath);
    }

    async fillBlankContractTemplate(contractDescription){  
      await this.editorWindow.click();
      await this.editorWindow.type(contractDescription);
    }

    async clickOnSaveBtn(){
        await this.saveBtn.click();
    }
    
      async verifyContractInTable(contractName) {
        const tableText = await this.contractTable.innerText();
        await expect(tableText).toContain(contractName);
      }

      async selectContractTypeAndFillContractName(contractType,contract_Name) {
        await this.page.selectOption('form [name="type"]',contractType);
        await this.contractName.fill(contract_Name);
        await this.continueBtn.click();
      }

      async selectBlankTemplate(){
        await this.blankContractTemplate.click();
      }

}
module.exports=ContractTemplatePage;