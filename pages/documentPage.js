const { expect } = require('@playwright/test');
const { waitForPaceLoader } = require('../utils/webUtils');

class DocumentPage {
  constructor(page) {
    this.page = page;
    this.locators = {
      uploadButton: '.button.blue:has-text("Upload document")',
      uploadInput: 'input#upload',
      confirmUploadButton: '.button.blue',
      selectItem: '.SelectItem',
      selectItemList: '.SelectItem li.item',
      saveButton: '.button.blue:has-text("Save")',
      createFolderButton: '.button.blue:has-text("Create new folder")',
      folderNameInput: '.modal-content input',
      confirmCreateFolderButton: '.modal-content .button.blue',
      folderRow: (folderName) => `.tr:has-text("${folderName}")`,
      folderDropdown: (folderName) => `.tr:has-text("${folderName}") .dropdown`,
      renameFolderOption: (folderName) => `.tr:has-text("${folderName}") .dropdown.focus .item:has-text("Rename folder")`,
      removeFolderOption: (folderName) => `.tr:has-text("${folderName}") .dropdown.focus .item:has-text("Remove folder")`,
      modalContent: '.modal-content',
      confirmRemoveFolderButton: '.modal-content .button:has-text("Remove folder")',
      addDefaultFolderButton: '.button.blue',
      defaultFolderNameInput: '.page input[type="text"]',
      successNotification: '.box.box-green',
      backToOverviewButton: '.button.blue',
      renameDefaultFolderOption: (folderName) => `//div[@class="tr"]//div[text()="${folderName}"]/parent::div//div[@class="dropdown focus"]//div[normalize-space()="Rename folder"]`,
      removeDefaultFolderOption: (folderName) => `//div[@class="tr"]//div[text()="${folderName}"]/parent::div//div[@class="dropdown focus"]//div[text()="Remove folder"]`,
      confirmRemoveDefaultFolderButton: '.modal-content .button.red'
    };
  }

  async uploadDocument(filePath) {
    await this.page.locator(this.locators.uploadButton).click();
    await this.page.setInputFiles(this.locators.uploadInput, filePath);
    await this.page.locator(this.locators.confirmUploadButton).click();
    await waitForPaceLoader(this.page);
  }

  async selectFirstFolder() {
    await this.page.locator(this.locators.selectItem).click();
    await this.page.waitForSelector(this.locators.selectItemList);
    await this.page.locator(this.locators.selectItemList).first().click();
  }

  async saveDocument() {
    await this.page.locator(this.locators.saveButton).click();
  }

  async createFolder(folderName) {
    await this.page.locator(this.locators.createFolderButton).click();
    await this.page.locator(this.locators.folderNameInput).fill(folderName);
    await this.page.locator(this.locators.confirmCreateFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  async openFolder(folderName) {
    await this.page.locator(this.locators.folderRow(folderName)).click();
    await waitForPaceLoader(this.page);
  }

  async renameFolder(oldName, newName) {
    await this.page.locator(this.locators.folderDropdown(oldName)).click();
    await this.page.locator(this.locators.renameFolderOption(oldName)).click();
    await this.page.locator(this.locators.folderNameInput).fill(newName);
    await this.page.locator(this.locators.confirmCreateFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  async removeFolder(folderName) {
    await this.page.locator(this.locators.folderDropdown(folderName)).click();
    await this.page.locator(this.locators.removeFolderOption(folderName)).click();
    await this.page.waitForSelector(this.locators.modalContent);
    await this.page.locator(this.locators.confirmRemoveFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  async addDefaultFolder(folderName) {
    await this.page.locator(this.locators.addDefaultFolderButton).first().click();
    await this.page.locator(this.locators.defaultFolderNameInput).first().fill(folderName);
    await this.page.locator(this.locators.addDefaultFolderButton).first().click();
    await this.page.waitForSelector(this.locators.successNotification);
    expect(await this.page.locator(this.locators.successNotification).innerText()).toContain('This folder has been added to the documents folder of all your employees');
    await this.page.locator(this.locators.backToOverviewButton).first().click();
    await waitForPaceLoader(this.page);
  }

  async renameDefaultFolder(oldName, newName) {
    await this.page.locator(this.locators.folderDropdown(oldName)).click();
    await this.page.locator(this.locators.renameDefaultFolderOption(oldName)).click();
    await this.page.locator(this.locators.folderNameInput).fill(newName);
    await this.page.locator(this.locators.confirmCreateFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  async removeDefaultFolder(folderName) {
    await this.page.locator(this.locators.folderDropdown(folderName)).click();
    await this.page.locator(this.locators.removeDefaultFolderOption(folderName)).click();
    await this.page.waitForSelector(this.locators.modalContent);
    await this.page.locator(this.locators.confirmRemoveDefaultFolderButton).click();
    await waitForPaceLoader(this.page);
  }
}

module.exports = DocumentPage;