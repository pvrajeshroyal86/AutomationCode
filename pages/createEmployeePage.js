const { test, expect } = require('@playwright/test');
const { waitForPaceLoader } = require('../utils/webUtils'); 
class CreateEmployeePage {
    
    constructor(page) {
        this.page = page;
        this.pageTitle=page.locator('h1.main-title');
        this.firstNameField = page.locator('input#inputfirstname');
        this.lastNameField = page.locator('input#inputname');
        this.emailField = page.locator('input#inputemail');
        this.continueBtn = '.step .button.blue';
    } 

    async getPageHeaderAndValidate() {
        await this.page.waitForSelector('h1.main-title');
        let title = this.page.locator('h1.main-title');
        await expect(title).toContainText('Add new person');
    }

   async createNewEmployee(first, last, email) {
         await this.firstNameField.fill(first);
         await this.lastNameField.fill(last);
         await this.emailField.fill(email);
         await expect(this.page.locator('.step .button.blue').tobeVisible());
         await this.page.click('.step .button.blue');
         waitForPaceLoader(this.page);
    }

   async validatePageHeaderAndSelectHRManualEntry() {
    let title = await this.page.locator('h1.main-title');
    await expect(title).toContainText('Employee self onboarding');
    await expect(this.page.locator('.buttons.mobile_text-center .button')).toHaveCount(2);
    // Skip self-service onboarding
    await this.page.click('.buttons.mobile_text-center .skip');
    }

    async getEmployeeId() {
        await expect(this.page).toHaveURL(/.*people\/\d+/); // URL should be /people/1234
        const newPersonId = this.page.url().split('/').reverse()[0];
        return newPersonId
    }

   async  validateEmployeeCard(first, last, email)
    {
        await expect(this.page.locator('.person-header .details .name')).toContainText(`${first} ${last}`);
        await expect(this.page.locator(`a:text("${email}")`)).toHaveCount(1); // Link to work email
        await expect(this.page.locator('.box.box-yellow')).toHaveCount(1); // Not on payroll box
        await expect(await this.page.locator('.ActivityFeed div.event:first-of-type .summary').innerText()).toMatch(new RegExp(`added ${first} ${last} as an employee`));

    }

    async navigateToPeopleHomePage()
    {
          // Person exists in list
        await this.page.click('a.link[href="/people"]');
        await waitForPaceLoader(this.page);
        await expect(this.page).toHaveURL(/.*people/); // URL should be /people
    }

    async validateEmployeeInPeopleList(first, last, newPersonId)
    { 
        await expect(this.page.locator('.table.list.boxxed a.tr:first-of-type .flex > span')).toContainText(`${first} ${last}`);
        await expect(this.page.locator(`.table.list.boxxed a.tr:first-of-type[href="/people/${newPersonId}"]`)).toHaveCount(1);
    }
}
module.exports = CreateEmployeePage;