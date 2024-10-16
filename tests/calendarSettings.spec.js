const { test, expect } = require('@playwright/test');
const data = require('../environment.json');
const CalendarSettingsPage = require('../pages/calendarSettingsPage');
const { generateCalendarTypeName } = require('../library/utils/fakerLibrary');
const { waitForPaceLoader } = require('../library/utils/webUtils');

const CURRENT_YEAR = new Date().getFullYear();

test.describe('Calendar Settings Tests', () => {
    test('check calendar types for current year', async ({ page }) => {
        const calendarSettingsPage = new CalendarSettingsPage(page);
        await page.goto(data.baseUrl + `settings/daysOffTypes?year=${CURRENT_YEAR}`);

        await waitForPaceLoader(page);
        let title = page.locator(calendarSettingsPage.locators.mainTitle);
        await expect(title).toHaveText(/Calendar types .*/, { timeout: 10000 });

        const types = page.locator(calendarSettingsPage.locators.calendarTypesList);
        const initialTypesCount = await types.count();

        // toggle inactive types visibility
        await calendarSettingsPage.toggleInactiveTypes();

        let typesIncludingInactive = page.locator(calendarSettingsPage.locators.calendarTypesList);
        const typesIncludingInactiveCount = await typesIncludingInactive.count();
        await expect(typesIncludingInactiveCount).toBeGreaterThanOrEqual(initialTypesCount);

        // add new type
        await calendarSettingsPage.gotoAddNewType(CURRENT_YEAR);
        title = page.locator(calendarSettingsPage.locators.mainTitle);
        await expect(title).toContainText("Create a new calendar type", { timeout: 10000 });
        await expect(page).toHaveURL(/.*settings\/daysOffTypes\/add/, { timeout: 10000 });

        const name = generateCalendarTypeName();
        const selectedColorText = await calendarSettingsPage.addNewCalendarType(name);

        // detailed settings for type
        await calendarSettingsPage.verifyCalendarTypeDetails(name, selectedColorText);

        await page.click(calendarSettingsPage.locators.backButton);

        // check if new type is added
        await expect(page).toHaveURL(/.*settings\/daysOffTypes/, { timeout: 10000 });
        await page.waitForSelector(calendarSettingsPage.locators.calendarTypesList);
        const updatedTypes = page.locator(calendarSettingsPage.locators.calendarTypesList);
        await expect(updatedTypes).toHaveCount(initialTypesCount + 1);

        // toggle active types visibility
        await calendarSettingsPage.toggleInactiveTypes();

        typesIncludingInactive = page.locator(calendarSettingsPage.locators.calendarTypesList);
        const currentActiveCount = await typesIncludingInactive.count();
        await expect(typesIncludingInactive).toHaveCount(currentActiveCount);

        // archive one of the types
        await page.click('.box.compact .list a:nth-child(2)');
        await calendarSettingsPage.archiveCalendarType();
        await expect(page).toHaveURL(/.*settings\/daysOffTypes/, { timeout: 10000 });
        await page.waitForSelector(calendarSettingsPage.locators.calendarTypesList);
        const finalTypes = page.locator(calendarSettingsPage.locators.calendarTypesList);
        await expect(finalTypes).toHaveCount(currentActiveCount - 1);
    });

    test('check default company holidays', async ({ page }) => {
        const calendarSettingsPage = new CalendarSettingsPage(page);
        const COUNTRY_MAP = {
            'BE': 10,
            'NL': 0,
            'FR': 0,
            'DE': 0,
            'ES': 0,
            'GB': 0
        };
        const COUNTRIES = Object.keys(COUNTRY_MAP);
        await page.goto(data.baseUrl + `settings/companyHolidays?year=${CURRENT_YEAR}`);

        for (const country of COUNTRIES) {
            await calendarSettingsPage.selectCountry(country);
            let activeHolidays = page.locator(calendarSettingsPage.locators.activeHolidays);
            await expect(activeHolidays).toHaveCount(COUNTRY_MAP[country], { timeout: 10000 });
        }
    });
});