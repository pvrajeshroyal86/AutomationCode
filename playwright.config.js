const config = {
    testDir: './tests',
    timeout: 100*1000,
    expect: {
        timeout: 5000
    },
    use: {
        browserName: 'chromium',
        headless: false,
        launchOptions: { slowMo: 50 },
        screenshot: 'only-on-failure'
    },
    workers: 1, // By default, all the tests are run in parallel, but we can limit the parallel run by keeping workers as 1
    reporter: 'allure-playwright',
};

module.exports = config;