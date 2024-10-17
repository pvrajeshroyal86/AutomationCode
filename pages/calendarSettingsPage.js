const { waitForPaceLoader } = require('../library/utils/webUtils');

class CalendarSettingsPage {
    constructor(page) {
        this.page = page;
        this.locators = {
            mainTitle: 'h1.main-title',
            calendarTypesList: '.box.compact .list a',
            toggleInactiveTypes: 'label.input-switch',
            addNewTypeButton: `.right.buttons a`,
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

    /**
     * Navigates to the add new calendar type page for the specified year.
     * @param {number} year - The year for which to add a new calendar type.
     */
    async gotoAddNewType() {
        await this.page.click(this.locators.addNewTypeButton);
    }

    /**
     * Toggles the visibility of inactive calendar types.
     */
    async toggleInactiveTypes() {
        await this.page.locator(this.locators.toggleInactiveTypes).click();
        await waitForPaceLoader(this.page);
    }

    /**
     * Adds a new calendar type with the specified name.
     * @param {string} name - The name of the new calendar type.
     * @returns {Promise<string>} The text of the selected color.
     */
    async addNewCalendarType(name) {
        await this.page.fill(this.locators.nameInput, name);
        await this.page.click(this.locators.colorDropdown);
        const selectedColorText = await this.page.locator(this.locators.selectedColor).innerText();
        await this.page.click(this.locators.selectedColor);
        await this.page.click(this.locators.saveButton);
        await waitForPaceLoader(this.page);
        return selectedColorText;
    }

    /**
     * Archives the currently selected calendar type.
     */
    async archiveCalendarType() {
        await this.page.click(this.locators.archiveButton);
        await waitForPaceLoader(this.page);
    }

    /**
     * Selects a country from the country dropdown.
     * @param {string} country - The country to select.
     */
    async selectCountry(country) {
        await this.page.selectOption(this.locators.countrySelect, country);
    }

    /**
     * Gets the count of active holidays.
     * @returns {Promise<number>} The count of active holidays.
     */
    async getActiveHolidaysCount() {
        return await this.page.locator(this.locators.activeHolidays).count();
    }
}

module.exports = CalendarSettingsPage;