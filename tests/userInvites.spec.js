const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const UserInvitesPage = require('../pages/userInvitesPage');
const { generateUserEmail } = require('../library/utils/fakerLibrary');

const getUsers = () => {
    return [
        generateUserEmail(),
        generateUserEmail()
    ];
}

test.describe('User Invites Tests', () => {
    test('invite users', async ({ page }) => {
        const userInvitesPage = new UserInvitesPage(page);

        // Navigate to the user settings page
        await page.goto(data.baseUrl + 'settings/users');
        await page.waitForSelector(userInvitesPage.locators.userList);

        // Get the initial count of users
        const initialCount = await page.locator(userInvitesPage.locators.userList).count();
        const userEmails = getUsers();
        const newUserCount = userEmails.length;

        // Invite new users
        await userInvitesPage.inviteUsers(userEmails);
        await expect(page).toHaveURL(data.baseUrl + 'settings/users');

        // Verify the new users are added
        const currentUsers = page.locator(userInvitesPage.locators.userList);
        await expect(currentUsers).toHaveCount(initialCount + newUserCount);

        const subjectEmail = userEmails[0];
        await userInvitesPage.verifyUserInvite(subjectEmail);

        // Verify the user invite details
        await expect(page.locator(userInvitesPage.locators.userEmailHeader)).toContainText(subjectEmail);
        await expect(page.locator(userInvitesPage.locators.withdrawInvite)).toContainText("Withdraw invite");
        await expect(page.locator(userInvitesPage.locators.defaultRole)).toContainText("Default");

        // Change the user role to specific teams
        await userInvitesPage.changeUserRoleToSpecificTeams();

        // Verify the user role details
        const subjectRow = page.locator(userInvitesPage.locators.userDetail(subjectEmail));
        await expect(subjectRow).toContainText("Specific teams");
        await expect(subjectRow).toContainText("Access to 1 team, access to wages");
    });
});