const { expect } = require('@playwright/test');
const { waitForPaceLoader } = require('../utils/webUtils');

class CalendarSettingsPage {
    constructor(page) {
        this.page = page;
        this.locators = {
            mainTitle: 'h1.main-title',
            calendarTypesList: '.box.compact .list a',
            toggleInactiveTypes: 'label.input-switch',
            addNewTypeButton: (year) => `.right.buttons a[href="/settings/daysOffTypes/add?year=${year}"]`,
            nameInput: 'input#name',
            colorDropdown: '.form .dropdown .target',
            selectedColor: '.form .dropdown .calendar-color:nth-child(10)',
            selectedColorText: '.form .dropdown .calendar-color:nth-child(1) .text',
            saveButton: 'form .button',
            detailedSettingsTab: '.tabs--box.tabs .tab.active',
            backButton: 'h1.main-title a.back',
            archiveButton: '.right.buttons .red',
            countrySelect: 'div[label="Country"] select',
            activeHolidays: '.calendar-day.active'
        };
    }

    async gotoAddNewType(year) {
        await this.page.click(this.locators.addNewTypeButton(year));
    }

    async toggleInactiveTypes() {
        await this.page.locator(this.locators.toggleInactiveTypes).click();
    }

    async addNewCalendarType(name) {
        await this.page.fill(this.locators.nameInput, name);
        await this.page.click(this.locators.colorDropdown);
        const selectedColorText = await this.page.locator(this.locators.selectedColor).innerText();
        await this.page.click(this.locators.selectedColor);
        await this.page.click(this.locators.saveButton);
        await waitForPaceLoader(this.page);
        return selectedColorText;
    }

    async verifyCalendarTypeDetails(name, selectedColorText) {
        await this.page.waitForSelector(this.locators.detailedSettingsTab);
        expect(await this.page.locator(this.locators.nameInput).inputValue()).toBe(name);
        expect((await this.page.locator(this.locators.selectedColorText).innerText()).trim()).toBe(selectedColorText.trim());
    }

    async archiveCalendarType() {
        await this.page.click(this.locators.archiveButton);
        await waitForPaceLoader(this.page);
    }

    async selectCountry(country) {
        await this.page.selectOption(this.locators.countrySelect, country);
    }

    async getActiveHolidaysCount() {
        return await this.page.locator(this.locators.activeHolidays).count();
    }
}

module.exports = CalendarSettingsPage;