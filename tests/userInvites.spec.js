const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const UserInvitesPage = require('../pages/userInvitesPage');
const { generateUserEmail } = require('../utils/fakerLibrary');

const getUsers = () => {
    return [
        generateUserEmail(),
        generateUserEmail()
    ];
}

test.describe('User Invites Tests', () => {
    test('invite users', async ({ page }) => {
        const userInvitesPage = new UserInvitesPage(page);
        await page.goto(data.baseUrl + 'settings/users');
        await page.waitForSelector(userInvitesPage.locators.userList);

        const initialCount = await page.locator(userInvitesPage.locators.userList).count();
        const userEmails = getUsers();
        const newUserCount = userEmails.length;

        await userInvitesPage.inviteUsers(userEmails);
        await expect(page).toHaveURL(data.baseUrl + 'settings/users');

        const currentUsers = page.locator(userInvitesPage.locators.userList);
        await expect(currentUsers).toHaveCount(initialCount + newUserCount);

        const subjectEmail = userEmails[0];
        await userInvitesPage.verifyUserInvite(subjectEmail);
        await userInvitesPage.changeUserRoleToSpecificTeams();
        await userInvitesPage.verifyUserRole(subjectEmail);
    });
});