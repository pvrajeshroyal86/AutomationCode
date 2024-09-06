
const { test,expect } = require('@playwright/test');
const data = require('../environment.json');
const newContract = require('../pages/contractTemplatePage.js');
const createContract = require('../pages/createContractPage.js');
const { waitForPaceLoader } = require('../utils/webUtils');
const TestUtils = require('../utils/testUtils');


test('it can create a new contract template from a blank template', async ({ page }) => {
  const contract= new newContract(page);

  const contractType="custom_contract";
  const contractName="New blank contract";
  const contractDescription="Hello World";

  await page.goto(data.baseUrl + 'settings/contracts/templates/new');
  await waitForPaceLoader(page);
  await contract.selectContractTypeAndFillContractName(contractType,contractName);
  await contract.selectBlankTemplate();
  await contract.fillBlankContractTemplate(contractDescription);
  await contract.clickOnSaveBtn();  
  await contract.verifyContractInTable(contractName);
});

test('it can create a new contract template from a word document', async ({ page }) => {
  const contractType="custom_contract";
  const contractName="New Work Contract";
  const contractDescription="Hello World";
  const filePath="fileManager/testTextdoc.docx";
  
  const contract= new newContract(page);

  await page.goto(data.baseUrl + 'settings/contracts/templates/new');
  await waitForPaceLoader(page);
  await contract.selectContractTypeAndFillContractName(contractType,contractName);
  await contract.uploadWordDocument(filePath);
  await contract.fillBlankContractTemplate(contractDescription);
  await contract.clickOnSaveBtn();  
  await contract.verifyContractInTable(contractName);
});

test('it can add a new contract from template to a person', async ({ page }) => {
  const contract = new createContract(page);

  await page.goto(data.baseUrl + 'contracts/new');
  await waitForPaceLoader(page);
  const employeeName=await contract.selectAssignee();
  await contract.selectContractType('template');
  await contract.clickContinue();
  await contract.selectContractTemplate();
  await contract.clickContinue();
  await contract.expectUrlToContainContractId();
  await page.goto(data.baseUrl + 'contracts');
  await waitForPaceLoader(page);
});

test('it can add a new contract from pdf to a person', async ({ page }) => {
  const contract = new createContract(page);
  await page.goto(data.baseUrl + 'contracts/new');
  await waitForPaceLoader(page);
  await contract.selectAssignee();
  await contract.selectContractType('pdf');
  await contract.clickContinue();
  await page.locator('.form-section').first().locator('.radio-button-list .radio-button-list-item').nth(1).click();
  await page.click('.blue.button');
  await page.locator('.form-section').first().locator('input').type('PDF contract');
  await page.setInputFiles('input#pdfUploadInput', 'tests/e2e/fixtures/test_pdf.pdf');
  await expect(page).toHaveURL(/.*contracts\/[0-9]*/);
});