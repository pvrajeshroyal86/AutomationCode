
// Helper function to sleep for a given time
const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to wait for the pace loader to disappear
const waitForPaceLoader = async (page) => {
  // Wait until pace is done
  await page.waitForSelector('.pace-done');
  
  // wait an extra 0.2 seconds just to be sure the page is fully loaded
  await sleep(200);

  return page;
};

// Exporting the function so it can be used in other files
module.exports = { waitForPaceLoader };