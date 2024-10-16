const { test } = require('@playwright/test');
const { waitForPaceLoader } = require('../library/utils/webUtils');
const { generateTeamName } = require('../library/utils/fakerLibrary');
const DashboardPage = require('../pages/dashboardPage');

test.describe('Dashboard Tests', () => {
  test('logged in with our saved state and can create/delete team', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
    await waitForPaceLoader(page);
    await dashboardPage.verifyLoggedIn();
    await dashboardPage.navigateToSettings();
    await dashboardPage.navigateToTeams();

    const teamName = generateTeamName();
    await dashboardPage.addTeam(teamName);

    const urlFragments = page.url().split('/');
    const teamId = urlFragments[urlFragments.length - 2];
    await dashboardPage.deleteTeam(teamId);
  });
});