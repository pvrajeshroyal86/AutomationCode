const { waitForPaceLoader } = require('../library/utils/webUtils');

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

  /**
   * Uploads a document to the page.
   * @param {string} filePath - The path to the document to upload.
   */
  async uploadDocument(filePath) {
    await this.page.locator(this.locators.uploadButton).click();
    await this.page.setInputFiles(this.locators.uploadInput, filePath);
    await this.page.locator(this.locators.confirmUploadButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Selects the first folder from the list.
   */
  async selectFirstFolder() {
    await this.page.locator(this.locators.selectItem).click();
    await this.page.waitForSelector(this.locators.selectItemList);
    await this.page.locator(this.locators.selectItemList).first().click();
  }

  /**
   * Saves the document.
   */
  async saveDocument() {
    await this.page.locator(this.locators.saveButton).click();
  }

  /**
   * Creates a new folder with the specified name.
   * @param {string} folderName - The name of the folder to create.
   */
  async createFolder(folderName) {
    await this.page.locator(this.locators.createFolderButton).click();
    await this.page.locator(this.locators.folderNameInput).fill(folderName);
    await this.page.locator(this.locators.confirmCreateFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Opens a folder with the specified name.
   * @param {string} folderName - The name of the folder to open.
   */
  async openFolder(folderName) {
    await this.page.locator(this.locators.folderRow(folderName)).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Renames a folder from old name to new name.
   * @param {string} oldName - The current name of the folder.
   * @param {string} newName - The new name for the folder.
   */
  async renameFolder(oldName, newName) {
    await this.page.locator(this.locators.folderDropdown(oldName)).click();
    await this.page.locator(this.locators.renameFolderOption(oldName)).click();
    await this.page.locator(this.locators.folderNameInput).fill(newName);
    await this.page.locator(this.locators.confirmCreateFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Removes a folder with the specified name.
   * @param {string} folderName - The name of the folder to remove.
   */
  async removeFolder(folderName) {
    await this.page.locator(this.locators.folderDropdown(folderName)).click();
    await this.page.locator(this.locators.removeFolderOption(folderName)).click();
    await this.page.waitForSelector(this.locators.modalContent);
    await this.page.locator(this.locators.confirmRemoveFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Adds a default folder with the specified name.
   * @param {string} folderName - The name of the default folder to add.
   */
  async addDefaultFolder(folderName) {
    await this.page.locator(this.locators.addDefaultFolderButton).first().click();
    await this.page.locator(this.locators.defaultFolderNameInput).first().fill(folderName);
    await this.page.locator(this.locators.addDefaultFolderButton).first().click();
    await this.page.waitForSelector(this.locators.successNotification);
  }

  /**
   * Renames a default folder from old name to new name.
   * @param {string} oldName - The current name of the default folder.
   * @param {string} newName - The new name for the default folder.
   */
  async renameDefaultFolder(oldName, newName) {
    await this.page.locator(this.locators.folderDropdown(oldName)).click();
    await this.page.locator(this.locators.renameDefaultFolderOption(oldName)).click();
    await this.page.locator(this.locators.folderNameInput).fill(newName);
    await this.page.locator(this.locators.confirmCreateFolderButton).click();
    await waitForPaceLoader(this.page);
  }

  /**
   * Removes a default folder with the specified name.
   * @param {string} folderName - The name of the default folder to remove.
   */
  async removeDefaultFolder(folderName) {
    await this.page.locator(this.locators.folderDropdown(folderName)).click();
    await this.page.locator(this.locators.removeDefaultFolderOption(folderName)).click();
    await this.page.waitForSelector(this.locators.modalContent);
    await this.page.locator(this.locators.confirmRemoveDefaultFolderButton).click();
    await waitForPaceLoader(this.page);
  }
}

module.exports = DocumentPage;