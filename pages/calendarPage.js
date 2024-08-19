class CalendarPage
{
    constructor(page) {
        this.page = page;
        this.searchEmployeeField=page.locator('.month-calendar-header .search input');
        this.firstsearchResult=page.locator('.person_name').first();
        this.addLeaveOption=page.locator('.buttons.fixed-bottom .button.blue');
        this.titleInCalendarpopup=page.locator('.sidebar-title-section');
        this.selectCalendarTypeDropdown=page.locator('.dropdown.select-dayoff-type')
        this.totalTime=page.locator('//label[.="Total time"]/..//input');
        this.confirmBtn=page.locator('.page-sidebar .button');   
        this.deleteLeaveOption=page.locator('.buttons.fixed-bottom .button.red');
        this.deleteBtn=page.locator('.page-sidebar .button.red');
        this.avilableDaysForEmployee=page.locator('.month-calendar-day.clickable.empty:not(.zeroSchedule):not(.nullSchedule)');
        this.closeLeaveWindow=page.locator('.close-icon-wrapper');
    }

/**
 * This method select add leave option and select the calendar type
 * @param {*} calendarType 
 */
async selectCalendarType(calendarType)
{
    await this.addLeaveOption.click();
    await this.selectCalendarTypeDropdown.click();
    await this.locator(`.page-sidebar .menu .tr:has-text("${calendarType}")`).click();
    await this.confirmBtn.click();  
}


/**
 * This method is to specify the amount of period employee is taking leave
 * @param {*} leavePeriod 
 */
async selectLeavePeriod(leavePeriod) 
{                                                                               // Normalize the input: Convert to lowercase and remove spaces
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

/**
 * This method is to select the number of days employee wants to take off
 * @param {*} daysToSelect 
 * @returns 
 */
async selectDaysOff(daysToSelect)
{    
    const DAYOFF_REQUEST_LIMIT = Math.floor(Math.random() * daysToSelect) + 1;
    for (var index= 0; index < DAYOFF_REQUEST_LIMIT ; index++)
    {
      await this.daysToSelect.nth(index).click();
    } 
    return DAYOFF_REQUEST_LIMIT;
}

/**
 * This method is to search the employee and get the available days count
 * @param {*} employeeName 
 * @returns 
 */
async getAvilableDaysCount(employeeName)
{  
    await this.waitForSelector(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
    const personRow =  this.locator(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);  // These rows have no semantic tags to know whether it's a day off,...
    const daysToSelect = await this.personRow.avilableDaysForEmployee.count();  // click couple extra days days to see if the count changes
    return avilableDaysCount;
}

async searchEmployee(employeeName)
{
    await this.searchEmployeeField.fill(employeeName);
    await waitForPaceLoader(page);
}

async getInitalSickLeavesCountForEmployee(employeeName,rgbValue)
{
    const personRow =  this.page.locator(`//div[@class='month-calendar-row' and contains(text(),'${employeeName}')]`);
    const initialCount = await personRow.locator(`.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="${rgbValue}"]`).count();
    return initialCount;
}

async getColorOfCalendarType(leaveType)
{
    await this.addLeaveOption.click();
    await this.selectCalendarTypeDropdown.click();
    await this.locator(`.page-sidebar .menu .tr:has-text("${calendarType}")`).click();
    const rgbValue = await page.$eval('.bar approved', element => {    // Extract the style property of the element
        return window.getComputedStyle(element).backgroundColor;
      });
    console.log('The rgb value '+rgbValue);
    await this.closeLeaveWindow.click();
    return rgbValue;
}

/**
 * This method is to validate the sick leaves taken count
 */
async validateSickLeavesTakenCount(countOfLeaves,initialCount,rgbValue)
{
    const personRow =  this.page.locator(`//div[@class='month-calendar-row' and contains(text(),'${employeeName}')]`);
    await expect(personRow.locator(`.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="${rgbValue}"]`)).toHaveCount(initialCount + countOfLeaves);
}

async removeSickDaysApplied(employeeName,rgbValue)   
{
   // remove all days off
   await this.waitForSelector(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
   const personRow =  this.page.locator(`//div[@class='month-calendar-row' and contains(.,'${employeeName}')]`);
const daysToRemove = personRow.locator(`.month-calendar-day.clickable:not(.zeroSchedule):not(.nullSchedule) .bar[style*="${rgbValue}"]`);
   const daysCount = await daysToRemove.count();
 
   for (index= 0; index < daysCount ; index++) {
     await daysToRemove.nth(index).click();
   }
 
   await this.deleteLeaveOption.click();
   await this.deleteBtn.click();
}


async fetchCalendarTypeColor(calendarType)
{
    
}

}
module.exports = CalendarPage;
