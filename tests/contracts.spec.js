
const { test } = require('@playwright/test');
const data = require('../environment.json');
const Login = require('../pages/loginPage');
const newContract = require('../pages/createNewContractPage.js');
const { waitForPaceLoader } = require('../utils/webUtils');


test('it can create a new contract template from a blank template', async ({ page }) => {
  const login = new Login(page);
  const contract= new newContract(page);

  const contractType="custom_contract";
  const contractName="New blank contract";
  const contractDescription="Hello World";

  await page.goto(data.baseUrl + 'settings/contracts/templates/new');
  await login.signIn(data.userName, data.password);
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
  const filePath="fixtures/testTextdoc.docx";
  
  const login = new Login(page);
  const contract= new newContract(page);

  await page.goto(data.baseUrl + 'settings/contracts/templates/new');
  await login.signIn(data.userName, data.password);
  await waitForPaceLoader(page);
  await contract.selectContractTypeAndFillContractName(contractType,contractName);
  await contract.uploadWordDocument(filePath);
  await contract.fillBlankContractTemplate(contractDescription);
  await contract.clickOnSaveBtn();  
  await contract.verifyContractInTable(contractName);
});