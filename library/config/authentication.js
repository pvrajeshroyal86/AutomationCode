const { chromium } = require('@playwright/test');
const data = require('../../environment.json');
const { waitForPaceLoader } = require('../../library/utils/webUtils');

module.exports = async config => {
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();

    try {
        await page.goto(data.baseUrl);
        await waitForPaceLoader(page);
        await page.locator('button.btn-auth').first().click();
        await page.locator('input#username').fill(data.userName);
        await page.locator('input#username').press('Tab');
        await page.locator('input#password').fill(data.password);
        await page.locator('button.btn-auth').click();
        await waitForPaceLoader(page);
        await page.context().storageState({ path: './.auth/user.json' });
    } catch (error) {
        console.error('Error during sign-in:', error);
    } finally {
        await browser.close();
    }
};