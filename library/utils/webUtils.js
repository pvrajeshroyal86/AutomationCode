// Helper function to sleep for a given time
const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to wait for the pace loader to disappear
const waitForPaceLoader = async (page) => {
  try {
    // Wait until pace is done
    await page.waitForSelector('.pace-done',{ timeout: 80000 });
    
    // wait an extra 0.2 seconds just to be sure the page is fully loaded
    await sleep(200);
  } catch (error) {
    console.error('Error waiting for pace loader:', error);
  }

  return page;
};

// Exporting the function so it can be used in other files
module.exports = { waitForPaceLoader };

/**
 * Wait until an element is removed or hidden
 * @param {Page} page playwright page object
 * @param {String} selector selector to wait for
 */
const waitForElementToDisappear = async (page, selector, tries = 'FIRST') => {
  const INITIAL_TRIES = 20; // 20 * 500ms = 10 seconds
  const TIMEOUT_BETWEEN_TRIES = 500;
  const count = await page.locator(selector).count()
  const isHidden = await page.locator(selector).isHidden()

  // Only one element can be wait for
  if (count > 1) {
    throw new Error(`More than one element found for selector ${selector}`)
  }

  // One element should be visisble to wait for
  if (count === 0 && tries === 'FIRST') {
    throw new Error(`No element found for selector ${selector} to wait for`)
  }

  // If element is gone or hidden => resolve
  if (count === 0 || isHidden) {
    return true
  }

  // Set initial tries on first attempt
  if (tries === 'FIRST') {
    tries = INITIAL_TRIES
  }

  // Reduce tries by 1
  tries = tries - 1

  // If we are at the last try, throw an error
  if (tries === 0) {
    throw new Error(`Element ${selector} did not disappear`)
  }

  // Wait 10ms
  await new Promise(resolve => setTimeout(resolve, TIMEOUT_BETWEEN_TRIES))

  // Try again
  return waitForElementToDisappear(page, selector, tries)
}
module.exports.waitForElementToDisappear = waitForElementToDisappear