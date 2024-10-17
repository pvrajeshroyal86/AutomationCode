const { waitForPaceLoader } = require('../library/utils/webUtils');

class ReusablePage {
    constructor(page) {
        this.page = page;
        this.locators = {
            totalHours: 'div.total-hours',
            nextButton: 'a.arrow.right',
            nextButtonDisabled: 'a.arrow.right.disabled',
        };
    }

    async getTotalHoursGreaterThanZero() {

        while (true) {
            await waitForPaceLoader(this.page);
            await this.page.waitForSelector(this.locators.totalHours, { state: 'visible' });
            const hoursElements = await this.page.$$(this.locators.totalHours);

            for (const element of hoursElements) {
                const hoursText = await element.innerText();
                const hours = parseFloat(hoursText.replace('h', ''));
                if (hours > 0) {
                    await element.click();
                    await this.page.waitForURL(/.*calendar\/person\/\d+/);
                    const personId = this.page.url().split('/').reverse()[0];
                    return personId; // Return the personId after clicking the element
                }
            }

            const nextButton = await this.page.$(this.locators.nextButton);
            const isDisabled = await this.page.$(this.locators.nextButtonDisabled);

            if (!nextButton || isDisabled) {
                console.log('Next button is not found or is disabled');
                break;
            }
            await nextButton.click();
        }
    }
}

module.exports = ReusablePage;