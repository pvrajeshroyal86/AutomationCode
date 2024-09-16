
const { test,expect } = require('@playwright/test');
const data = require('../environment.json');
const newContract = require('../pages/contractTemplatePage');
const createContract = require('../pages/createContractPage');
const { waitForPaceLoader } = require('../utils/webUtils');
const { generateRandomNumber } = require('../utils/fakerLibrary');

let CONTRACT_ID;
let Pdf_CONTRACT_ID;

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

test.describe('Contract Pdf Suite', () => {

test('it can add a new contract from pdf to a person', async ({ page }) => {
  const filePath="fileManager/CourseCertificate.pdf";
  const contract_title="PDF Contract"+generateRandomNumber(1,1000);
  
  const contract = new createContract(page);
  await page.goto(data.baseUrl +'contracts/new');
  await waitForPaceLoader(page);
  const employeeName=await contract.selectAssignee();
  await contract.selectContractType('pdf');
  await contract.clickContinue();
  await contract.selectWhoShouldSignOnContract('employee_Sign');
  await contract.clickContinue();
  await contract.fillContractTitle(contract_title);
  await contract.uploadPdfDocument(filePath);
  Pdf_CONTRACT_ID=await contract.expectUrlToContainContractId();
  await page.goto(data.baseUrl + 'contracts');
  await contract.verifyContractInTable(Pdf_CONTRACT_ID,employeeName,contract_title);
});

test('it can download a contract', async ({ page }) => {  // not working as expected in local to complete automation
  const contract = new createContract(page);
  
  await page.goto(data.baseUrl +`contracts/1474`);
  await contract.selectContractDownloadOption();
  await page.waitForEvent('download')
});

test('it can archive a contract', async ({ page }) => {
  const contract = new createContract(page);

  await page.goto(data.baseUrl + 'contracts');
  await waitForPaceLoader(page);
  await page.goto(data.baseUrl +`contracts/${Pdf_CONTRACT_ID}`);
  await waitForPaceLoader(page)
  await contract.selectContractArchiveOptionAndConfirm();
  await expect(page).toHaveURL(/.*contracts$/);
  await page.goto(data.baseUrl +`contracts/${Pdf_CONTRACT_ID}`);
  await waitForPaceLoader(page);  
  contract.verifyArchiveMessage();
});

test('it can delete a contract permanently', async ({ page }) => {
  const contract= new createContract(page);

  await page.goto(data.baseUrl +'contracts/new');
  await waitForPaceLoader(page);
  await page.goto(data.baseUrl+`contracts/${Pdf_CONTRACT_ID}`);
  await waitForPaceLoader(page);
  await contract.performPermanentDeleteForContract();
  await contract.verifyUrlAfterCOntractDeletion(Pdf_CONTRACT_ID)
});

});


test.describe('Contract Template Suite', () => {

test('it can add a new contract from template to a person', async ({ page }) => {
  const contract = new createContract(page);

  await page.goto(data.baseUrl + 'contracts/new');
  await waitForPaceLoader(page);
  const employeeName=await contract.selectAssignee();
  await contract.selectContractType('template');
  await contract.clickContinue();
  const contractTemplate=await contract.selectContractTemplate();
  await contract.clickContinue();
  CONTRACT_ID=await contract.expectUrlToContainContractId();
  await page.goto(data.baseUrl + 'contracts');
  await waitForPaceLoader(page);
  await contract.verifyContractInTable(CONTRACT_ID,employeeName,contractTemplate);
});

test('edit a contract content', async ({ page }) => {
  const contract = new createContract(page);
  const contractTextToAdd = 'This is a test contract content';
  await page.goto(data.baseUrl + 'contracts');
  await waitForPaceLoader(page);
  await page.goto(data.baseUrl +`contracts/${CONTRACT_ID}`);
  await waitForPaceLoader(page);
  await contract.selectContractEditOption();
  await contract.editContractContentAndSave(contractTextToAdd);
  const contractIdUpdated=await contract.expectUrlToContainContractId();
  expect(CONTRACT_ID).toBe(contractIdUpdated);
  await contract.verifyUpdatedContractContent(contractTextToAdd);
});

test('it can archive a contract', async ({ page }) => {
  const contract = new createContract(page);

  await page.goto(data.baseUrl + 'contracts');
  await waitForPaceLoader(page);
  await page.goto(data.baseUrl +`contracts/${CONTRACT_ID}`);
  await waitForPaceLoader(page)
  await contract.selectContractArchiveOptionAndConfirm();
  await expect(page).toHaveURL(/.*contracts$/);
  await page.goto(data.baseUrl +`contracts/${CONTRACT_ID}`);
  await waitForPaceLoader(page);  
  contract.verifyArchiveMessage();
});

test('it can unarchive a contract', async ({ page }) => {
  const contract = new createContract(page);
  await page.goto(data.baseUrl + 'contracts');
  await waitForPaceLoader(page);
  await page.goto(data.baseUrl + `contracts/${CONTRACT_ID}`);
  await waitForPaceLoader(page);
  await contract.performUnarchive() ;
});

});