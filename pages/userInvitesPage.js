const { expect } = require('@playwright/test');
const { waitForPaceLoader } = require('../utils/webUtils');

class UserInvitesPage {
    constructor(page) {
        this.page = page;
        this.locators = {
            userList: '.list .tbody a.clickable',
            inviteButton: '.right.buttons a[href="/settings/users/invite"]',
            emailTextarea: 'form textarea',
            submitButton: 'form button[type=submit]',
            userDetail: (email) => `.list a:has-text("${email}")`,
            userEmailHeader: '.margin-left-below-main-title',
            withdrawInvite: '.box-yellow',
            defaultRole: '.RadioButtonCardGrid-box--selected .RadioButtonCardGrid-title',
            specificTeamsRole: '.RadioButtonCardGrid-box:has-text("Specific teams")',
            firstTeamCheckbox: '.select-team-checkboxes .cursor-pointer:nth-child(1)',
            wagesToggle: '.form-toggle-row:nth-child(1) .mobile_justify-start:last-child .cursor-pointer',
            documentsToggle: '.form-toggle-row:nth-child(3) .mobile_justify-start:last-child .cursor-pointer',
            confirmButton: '.buttons.fixed-bottom .blue.button'
        };
    }

    async inviteUsers(userEmails) {
        await this.page.click(this.locators.inviteButton);
        await this.page.fill(this.locators.emailTextarea, userEmails.join('\n'));
        await this.page.click(this.locators.submitButton);
        await waitForPaceLoader(this.page);
    }

    async verifyUserInvite(email) {
        await expect(this.page).toHaveURL(/.*settings\/users/);
        await this.page.click(this.locators.userDetail(email));
        await expect(this.page.locator(this.locators.userEmailHeader)).toContainText(email);
        await expect(this.page.locator(this.locators.withdrawInvite)).toContainText("Withdraw invite");
        await expect(this.page.locator(this.locators.defaultRole)).toContainText("Default");
    }

    async changeUserRoleToSpecificTeams() {
        await this.page.click(this.locators.specificTeamsRole);
        await this.page.waitForSelector(this.locators.firstTeamCheckbox);
        await this.page.click(this.locators.firstTeamCheckbox);
        await this.page.click(this.locators.wagesToggle);
        await this.page.click(this.locators.documentsToggle);
        await this.page.click(this.locators.confirmButton);
        await waitForPaceLoader(this.page);
    }

    async verifyUserRole(email) {
        const subjectRow = this.page.locator(this.locators.userDetail(email));
        await expect(subjectRow).toContainText("Specific teams");
        await expect(subjectRow).toContainText("Access to 1 team, access to wages");
    }
}

module.exports = UserInvitesPage;