const puppeteer = require('puppeteer');
const { writeFile } = require('fs').promises;

(async () => {
    const lighthouse = await import('lighthouse');
    const chromeLauncher = await import('chrome-launcher');

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--remote-debugging-port=9222'],
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.type('input[name="replace-me-with-your-login-imput-name"]', 'your-username');
    await page.type('input[name="replace-me-with-your-password-imput-name"]', 'your-password');
    await page.click('input[name="submit"]');
    await page.waitForNavigation();

    const result = await lighthouse.default(page.url(), {
        port: new URL(browser.wsEndpoint()).port,
        output: 'html',
        onlyCategories: ['accessibility'],
    });

//    Run Lighthouse for desktop
//    const result = await lighthouse(page.url(), {
//        port: new URL(browser.wsEndpoint()).port,
//        output: 'html',
//        onlyCategories: ['accessibility'],
//        formFactor: 'desktop',
//        screenEmulation: {
//            mobile: false,
//            width: 1920,
//            height: 1080,
//            deviceScaleFactor: 1,
//            disabled: false,
//        },
//    });

//    Run Lighthouse for mobile
//    const result = await lighthouse(page.url(), {
//        port: new URL(browser.wsEndpoint()).port,
//        output: 'html',
//        onlyCategories: ['accessibility'],
//        formFactor: 'mobile', // Switch to mobile emulation
//        screenEmulation: {
//            mobile: true, // Enable mobile mode
//            width: 375,   // Typical mobile screen width
//            height: 812,  // Typical mobile screen height (e.g., iPhone X)
//            deviceScaleFactor: 3, // Scale factor for high-resolution displays
//            disabled: false, // Enable emulation
//        },
//    });

    await writeFile('lighthouse-report.html', result.report);
    console.log('Report generated: lighthouse-report.html');

    await browser.close();
})();