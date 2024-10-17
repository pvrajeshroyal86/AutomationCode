const { test, expect } = require('@playwright/test');
const { waitForPaceLoader } = require('../library/utils/webUtils');
const { generateTeamName } = require('../library/utils/fakerLibrary');
const DashboardPage = require('../pages/dashboardPage');

test.describe('Dashboard Tests', () => {
  test('logged in with our saved state and can create/delete team', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Navigate to the dashboard
    await dashboardPage.gotoDashboard();
    await waitForPaceLoader(page);

    // Verify the user is logged in
    await dashboardPage.verifyLoggedIn();

    // Navigate to settings and then to teams
    await dashboardPage.navigateToSettings();
    await dashboardPage.navigateToTeams();

    // Generate a new team name and add the team
    const teamName = generateTeamName();
    await dashboardPage.addTeam(teamName);
    await waitForPaceLoader(page);

    // Verify the team is added by checking the URL and page title
    const addPeopleTitle = page.locator(dashboardPage.locators.mainTitle);
    await expect(addPeopleTitle).toHaveText(/Add people to .*/);

    // Extract the team ID from the URL
    const urlFragments = page.url().split('/');
    const teamId = urlFragments[urlFragments.length - 2];

    // Delete the team
    await dashboardPage.deleteTeam(teamId);
    await waitForPaceLoader(page);
    // Verify the team is deleted by checking the URL and team detail link count
    await expect(page).toHaveURL(/.*settings\/teams/);
    const teamDetailLink = page.locator(dashboardPage.locators.teamDetailLink(teamId));
    await expect(teamDetailLink).toHaveCount(0);
  });
});