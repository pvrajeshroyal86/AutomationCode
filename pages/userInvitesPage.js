const { waitForPaceLoader } = require('../library/utils/webUtils');

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

    /**
     * Invites users by filling in their emails and submitting the form.
     * @param {string[]} userEmails - Array of user emails to invite.
     */
    async inviteUsers(userEmails) {
        await this.page.click(this.locators.inviteButton);
        await this.page.fill(this.locators.emailTextarea, userEmails.join('\n'));
        await this.page.click(this.locators.submitButton);
        await waitForPaceLoader(this.page);
    }

    /**
     * Verifies the user invite by clicking on the user detail.
     * @param {string} email - The email of the user to verify.
     */
    async verifyUserInvite(email) {
        await this.page.click(this.locators.userDetail(email));
    }

    /**
     * Changes the user role to specific teams.
     */
    async changeUserRoleToSpecificTeams() {
        await this.page.click(this.locators.specificTeamsRole);
        await this.page.waitForSelector(this.locators.firstTeamCheckbox);
        await this.page.click(this.locators.firstTeamCheckbox);
        await this.page.click(this.locators.wagesToggle);
        await this.page.click(this.locators.documentsToggle);
        await this.page.click(this.locators.confirmButton);
        await waitForPaceLoader(this.page);
    }
}

module.exports = UserInvitesPage;