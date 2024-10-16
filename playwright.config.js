const config = {
    globalSetup: require.resolve('./library/config/authentication.js'),
    testDir: './tests',
    timeout: 100 * 1000,
    expect: {
        timeout: 5000
    },
    use: {
        browserName: 'chromium',
        headless: false,
        launchOptions: { slowMo: 50 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        storageState: './library/.auth/user.json',
        trace: 'on', // Enable tracing
    },
    workers: 1,
    reporter: 'allure-playwright',
};

module.exports = config;