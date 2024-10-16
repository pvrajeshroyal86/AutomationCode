const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const newContract = require('../pages/contractTemplatePage');
const createContract = require('../pages/createContractPage');
const { waitForPaceLoader } = require('../library/utils/webUtils');
const { generateRandomNumber, generateEmail } = require('../library/utils/fakerLibrary');

let CONTRACT_ID;
let CONTRACT_ID_FOR_EMP_SIGNATURE;
let Pdf_CONTRACT_ID;
const Pdf_CONTRACT_TITLE = "PDF Contract" + generateRandomNumber(1, 1000);

test('it can create a new contract template from a blank template', async ({ page }) => {
  const contract = new newContract(page);

  const contractType = "custom_contract";
  const contractName = "New blank contract";
  const contractDescription = "Hello World";

  await page.goto(data.baseUrl + 'settings/contracts/templates/new');
  await waitForPaceLoader(page);
  await contract.selectContractTypeAndFillContractName(contractType, contractName);
  await contract.selectBlankTemplate();
  await contract.fillBlankContractTemplate(contractDescription);
  await contract.clickOnSaveBtn();
  await contract.verifyContractInTable(contractName);
});

test('it can create a new contract template from a word document', async ({ page }) => {
  const contractType = "custom_contract";
  const contractName = "New Work Contract";
  const contractDescription = "Hello World";
  const filePath = "fileManager/testTextdoc.docx";

  const contract = new newContract(page);

  await page.goto(data.baseUrl + 'settings/contracts/templates/new');
  await waitForPaceLoader(page);
  await contract.selectContractTypeAndFillContractName(contractType, contractName);
  await contract.uploadWordDocument(filePath);
  await contract.fillBlankContractTemplate(contractDescription);
  await contract.clickOnSaveBtn();
  await contract.verifyContractInTable(contractName);
});

test.describe('Contract Pdf Suite', () => {

  test('it can add a new contract from pdf to a person', async ({ page }) => {
    const filePath = "fileManager/CourseCertificate.pdf";

    const contract = new createContract(page);
    await page.goto(data.baseUrl + 'contracts/new');
    await waitForPaceLoader(page);
    const employeeName = await contract.selectAssignee();
    await contract.selectContractType('pdf');
    await contract.clickContinue();
    await contract.selectWhoShouldSignOnContract('employee_Employer_Sign');
    await contract.clickContinue();
    await contract.fillContractTitle(Pdf_CONTRACT_TITLE);
    await contract.uploadPdfDocument(filePath);
    Pdf_CONTRACT_ID = await contract.expectUrlToContainContractId();
    await page.goto(data.baseUrl + 'contracts');
    await contract.verifyContractInTable(Pdf_CONTRACT_ID, employeeName, Pdf_CONTRACT_TITLE);
  });

  test('it can download a contract', async ({ page }) => {  // not working as expected in local to complete automation
    const contract = new createContract(page);
    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${Pdf_CONTRACT_ID}`);
    await contract.selectContractDownloadOption();
    await page.waitForEvent('download');
  });

  test('it can archive a contract', async ({ page }) => {
    const contract = new createContract(page);

    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${Pdf_CONTRACT_ID}`);
    await waitForPaceLoader(page)
    await contract.selectContractArchiveOptionAndConfirm();
    await expect(page).toHaveURL(/.*contracts$/);
    await page.goto(data.baseUrl + `contracts/${Pdf_CONTRACT_ID}`);
    await waitForPaceLoader(page);
    contract.verifyArchiveMessage();
  });

  test('it can delete a contract permanently', async ({ page }) => {
    const contract = new createContract(page);

    await page.goto(data.baseUrl + 'contracts/new');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${Pdf_CONTRACT_ID}`);
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
    const employeeName = await contract.selectAssignee();
    await contract.selectContractType('template');
    await contract.clickContinue();
    const contractTemplate = await contract.selectContractTemplate();
    await contract.clickContinue();
    CONTRACT_ID = await contract.expectUrlToContainContractId();
    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await contract.verifyContractInTable(CONTRACT_ID, employeeName, contractTemplate);
  });

  test('edit a contract content', async ({ page }) => {
    const contract = new createContract(page);
    const contractTextToAdd = 'This is a test contract content';
    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID}`);
    await waitForPaceLoader(page);
    await contract.selectContractEditOption();
    await contract.editContractContentAndSave(contractTextToAdd);
    const contractIdUpdated = await contract.expectUrlToContainContractId();
    expect(CONTRACT_ID).toBe(contractIdUpdated);
    await contract.verifyUpdatedContractContent(contractTextToAdd);
  });

  test('it can archive a contract', async ({ page }) => {
    const contract = new createContract(page);

    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID}`);
    await waitForPaceLoader(page)
    await contract.selectContractArchiveOptionAndConfirm();
    await expect(page).toHaveURL(/.*contracts$/);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID}`);
    await waitForPaceLoader(page);
    contract.verifyArchiveMessage();
  });

  test('it can unarchive a contract', async ({ page }) => {
    const contract = new createContract(page);
    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID}`);
    await waitForPaceLoader(page);
    await contract.performUnarchive();
  });
});

test.describe('Contract Employee Signature Suite', () => {

  test('it can add a new contract from template to a person', async ({ page }) => {
    const contract = new createContract(page);

    await page.goto(data.baseUrl + 'contracts/new');
    await waitForPaceLoader(page);
    await contract.selectFirstAssignee();
    await contract.selectContractType('template');
    await contract.clickContinue();
    await contract.selectContractTemplate();
    await contract.clickContinue();
    CONTRACT_ID_FOR_EMP_SIGNATURE = await contract.expectUrlToContainContractId();
  });

  test('choose signature method and send for employee signature', async ({ page }) => {
    const contract = new createContract(page);
    const workEmail = generateEmail();
    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID_FOR_EMP_SIGNATURE}`);
    await waitForPaceLoader(page);
    await contract.chooseSignatureMethodAndSendForEmployeeSignature(workEmail);
  });

  test('it can sign a contract for employeer', async ({ page }) => {      // hard coded contract number
    const employeerName = "yolo@test.be";
    const contract = new createContract(page);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID_FOR_EMP_SIGNATURE}`);
    await waitForPaceLoader(page);
    await contract.performEmployeerSignatureAndVerifyStatus(employeerName);
  });

  test('Reminder functionality for employee', async ({ page }) => {
    const contract = new createContract(page);

    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID_FOR_EMP_SIGNATURE}`);
    await waitForPaceLoader(page);
    await contract.SendReminderAndVerify();
  });

  test('Contract Signature Reset', async ({ page }) => {
    const contract = new createContract(page);

    await page.goto(data.baseUrl + 'contracts');
    await waitForPaceLoader(page);
    await page.goto(data.baseUrl + `contracts/${CONTRACT_ID_FOR_EMP_SIGNATURE}`);
    await waitForPaceLoader(page);
    await contract.ResetSignatureMethodForContract();
  });

  test('Check for Employee Signature', async ({ page }) => {
    const filePath = "fileManager/CourseCertificate.pdf";

    const contract = new createContract(page);
    await page.goto(data.baseUrl + 'contracts/new');
    await waitForPaceLoader(page);
    await contract.selectFirstAssignee();
    await contract.selectContractType('pdf');
    await contract.clickContinue();
    await contract.selectWhoShouldSignOnContract('employee_Sign');
    await contract.clickContinue();
    await contract.fillContractTitle(Pdf_CONTRACT_TITLE);
    await contract.uploadPdfDocument(filePath);
    await contract.verifyForEmployeeSignature();
  });

  test('Check for No Signature', async ({ page }) => {
    const filePath = "fileManager/CourseCertificate.pdf";

    const contract = new createContract(page);
    await page.goto(data.baseUrl + 'contracts/new');
    await waitForPaceLoader(page);
    await contract.selectFirstAssignee();
    await contract.selectContractType('pdf');
    await contract.clickContinue();
    await contract.selectWhoShouldSignOnContract('nobody');
    await contract.clickContinue();
    await contract.fillContractTitle(Pdf_CONTRACT_TITLE);
    await contract.uploadPdfDocument(filePath);
    await contract.verifyForNoSignature();
  });

});

test('add contracts in bulk and verify', async ({ page }) => {
  const contract = new createContract(page);
  await page.goto(data.baseUrl + 'contracts');
  await waitForPaceLoader(page);
  await contract.addContractsInBulkAndVerify();
});