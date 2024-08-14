class CalendarPage
{
    constructor(page) {
        this._page = page;
        this.searchEmployeeField=page.locator('.month-calendar-header .search input');
        this.firstsearchResult=page.locator('.person_name').first();
        this.addbutton=page.locator('.buttons.fixed-bottom .button.blue');
        this.titleInCalendarpopup=page.locator('.sidebar-title-section');
        this.selectCalendarTypeDropdown=page.locator('.dropdown.select-dayoff-type')
        this.totalTime=page.locator('//label[.="Total time"]/..//input');
        this.confirmBtn=page.locator('.page-sidebar .button');    
    }

async selectCalendarType(calendarType)
{
    await this.selectCalendarTypeDropdown.click();
    await this.page.locator(`//div[@class='item calendar-color']/span[.='${calendarType}']`).click();
}

async selectLeaveOption(leaveType)
{
    await this.page.locator(`//div[@class='bg-transparent tabs']/div[normalize-space()='${dayPeriod}']`).click();
}

async selectLeavePeriod(leavePeriod) 
{                                                 // Normalize the input: Convert to lowercase and remove spaces
    const normalizedLeavePeriod = leavePeriod.toLowerCase().replace(/\s+/g, '');

    switch (normalizedLeavePeriod) {
        case 'allday':
            await this.selectLeaveOption('All Day');
            break;
        case 'morning':
            await this.selectLeaveOption('Morning');
            break;
        case 'afternoon':
            await this.selectLeaveOption('Afternoon');
            break;
        case 'specifichours':
            await this.selectLeaveOption('Specific Hours');
            break;
        default: 
            console.log('Invalid leave period option');
            break;
    }
}

async clickonSubmitBtn()
{
    await this.confirmBtn.click();
}

async selectDaysOff(avilableDaysCount)
{    
    const DAYOFF_REQUEST_LIMIT = Math.floor(Math.random() * avilableDaysCount) + 1;
    for (var index= 0; index < DAYOFF_REQUEST_LIMIT ; index++)
    {
      await daysToSelect.nth(index).click();
    } 
}


async searchEmployeeAndGetavilableDaysCount(employeeName)
{
    await this.searchEmployeeField.fill(employeeName);
    await page.waitForSelector(`.month-calendar-row:has-text("${employeeName}")`);
    const personRow =  page.locator(`.month-calendar-row:has-text("${employeeName}")`);
    // These rows have no semantic tags to know whether it's a day off,...
    // To check the count, we have to filter based on inline orange color `rgb(249, 105, 14)`
    // w/ inline css property of 'wettelijk' verlof in child `div.bar`
    const initialCount = await personRow.locator('.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="rgb(249, 105, 14)"]').count();
  
    // click couple extra days days to see if the count changes
    const avilableDaysCount = await personRow.locator('.month-calendar-day.clickable.empty:not(.zeroSchedule):not(.nullSchedule)').count();
    return avilableDaysCount;
}

}
module.exports = CalendarPage;
