const { expect } = require('@playwright/test');
const data = require('../environment.json');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.locators = {
      dashboardUrl: data.baseUrl + 'dashboard',
      settingsLink: '#XHeader .right.menu a[href="/settings"]',
      settingsTeamsLink: '.simple.links.list a[href="/settings/teams"]',
      addTeamLink: '.right.buttons a[href="/settings/teams/add"]',
      teamNameInput: 'input#name',
      teamDetailLink: (teamId) => `.table.list.boxxed a[href="/settings/teams/${teamId}"]`,
      deleteTeamLink: (teamId) => `.right.buttons a[href="/settings/teams/${teamId}/delete"]`,
      confirmDeleteButton: '.red.button',
      mainTitle: 'h1.main-title',
      loggedInHeader1: '.page-container.loggedIn h1',
      loggedInHeader2: '.page-container.loggedIn h2',
    };
  }

  async gotoDashboard() {
    await this.page.goto(this.locators.dashboardUrl);
  }

  async verifyLoggedIn() {
    await expect(this.page).toHaveURL(/.*dashboard/);
    const h1 = await this.page.locator(this.locators.loggedInHeader1);
    const h2 = await this.page.locator(this.locators.loggedInHeader2);
    const minutesInDay = (new Date().getHours() * 60) + new Date().getMinutes();
    if (minutesInDay >= 11 * 60 + 31 && minutesInDay <= 14 * 60) {
      await expect(h1).toHaveText(/Hi .*/);
    } else {
      await expect(h1).toHaveText(/Good .*/);
    }
    await expect(h2).toHaveText(/This is what\'s happening at .*/);
  }

  async navigateToSettings() {
    await this.page.click(this.locators.settingsLink);
    await expect(this.page).toHaveURL(/.*settings/);
    const title = this.page.locator(this.locators.mainTitle);
    await expect(title).toHaveText(/Settings/);
  }

  async navigateToTeams() {
    await this.page.click(this.locators.settingsTeamsLink);
    await expect(this.page).toHaveURL(/.*settings\/teams/);
    const settingsTitle = this.page.locator(this.locators.mainTitle);
    await expect(settingsTitle).toHaveText(/Teams/);
  }

  async addTeam(teamName) {
    await this.page.click(this.locators.addTeamLink);
    await expect(this.page).toHaveURL(/.*settings\/teams\/add/);
    await this.page.fill(this.locators.teamNameInput, teamName);
    await this.page.press(this.locators.teamNameInput, 'Enter');
    const addPeopleTitle = this.page.locator(this.locators.mainTitle);    
    await expect(addPeopleTitle).toHaveText(/Add people to .*/);
  }

  async deleteTeam(teamId) {
    await this.page.goto(data.baseUrl + 'settings/teams');
    await this.page.click(this.locators.teamDetailLink(teamId));
    await this.page.click(this.locators.deleteTeamLink(teamId));
    const confirmTitle = this.page.locator(this.locators.mainTitle);
    await expect(confirmTitle).toHaveText(/Are you sure you want to delete .*/);
    await this.page.click(this.locators.confirmDeleteButton);
    await expect(this.page).toHaveURL(/.*settings\/teams/);
    const teamDetailLink = this.page.locator(this.locators.teamDetailLink(teamId));
    await expect(teamDetailLink).toHaveCount(0);
  }
}

module.exports = DashboardPage;