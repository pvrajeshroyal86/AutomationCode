const { test } = require('@playwright/test');
const { generateTeamName } = require('../utils/fakerLibrary');
const DashboardPage = require('../pages/dashboardPage');

test.describe('Dashboard Tests', () => {
  test('is logged in with our saved state', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
    await dashboardPage.verifyLoggedIn();
  });

  test('can create/delete team', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
    await dashboardPage.navigateToSettings();
    await dashboardPage.navigateToTeams();

    const teamName = generateTeamName();
    await dashboardPage.addTeam(teamName);

    const urlFragments = page.url().split('/');
    const teamId = urlFragments[urlFragments.length - 2];
    await dashboardPage.deleteTeam(teamId);
  });
});