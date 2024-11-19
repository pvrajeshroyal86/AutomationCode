// Helper function to sleep for a given time
const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
 
// Function to wait for the pace loader to appear
const waitForPaceLoader = async (page) => {
  try {
    // Wait until pace is done
    await page.waitForSelector('.pace-done', { timeout: 100000 });
   
    // wait an extra 0.2 seconds just to be sure the page is fully loaded
    await sleep(200);
  } catch (error) {
    console.error('Error waiting for pace loader:', error);
  }
 
  return page;
};

// Function to wait for the pace loader to appear
const waitForPaceAlongRunnerLoader = async (page) => {
  try {
    // Wait until pace is done
    await page.waitForSelector(':is(body.pace-done,body.pace-running)', { timeout: 150000 });
   
    // wait an extra 0.2 seconds just to be sure the page is fully loaded
    await sleep(200);
  } catch (error) {
    console.error('Error waiting for pace loader:', error);
  }
 
  return page;
};
 
// Function to wait for the request handled to appear
const waitForRequestHandled = async (page) => {
  try {
    // Wait until requests are handled
    await page.waitForSelector('.requests-handled', { timeout: 100000 });
   
    // wait an extra 0.2 seconds just to be sure the page is fully loaded
    await sleep(200);
  } catch (error) {
    console.error('Error waiting for requests handled:', error);
  }
 
  return page;
};
 
/**
 * Wait until an element is removed or hidden
 * @param {Page} page playwright page object
 * @param {String} selector selector to wait for
 */
const waitForElementToDisappear = async (page, selector, tries = 'FIRST') => {
  const INITIAL_TRIES = 20; // 20 * 500ms = 10 seconds
  const TIMEOUT_BETWEEN_TRIES = 500;
  const count = await page.locator(selector).count();
  const isHidden = await page.locator(selector).isHidden();
 
  // Only one element can be waited for
  if (count > 1) {
    throw new Error(`More than one element found for selector ${selector}`);
  }
 
  // One element should be visible to wait for
  if (count === 0 && tries === 'FIRST') {
    throw new Error(`No element found for selector ${selector} to wait for`);
  }
 
  // If element is gone or hidden => resolve
  if (count === 0 || isHidden) {
    return true;
  }
 
  // Set initial tries on first attempt
  if (tries === 'FIRST') {
    tries = INITIAL_TRIES;
  }
 
  // Reduce tries by 1
  tries -= 1;
 
  // If we are at the last try, throw an error
  if (tries === 0) {
    throw new Error(`Element ${selector} did not disappear`);
  }
 
  // Wait 500ms
  await sleep(TIMEOUT_BETWEEN_TRIES);
 
  // Try again
  return waitForElementToDisappear(page, selector, tries);
};
 
// Exporting the functions so they can be used in other files
module.exports = {
  waitForPaceLoader,
  waitForPaceAlongRunnerLoader,
  waitForRequestHandled,
  waitForElementToDisappear
};