import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';
import lighthouse from 'lighthouse';
import path from 'path';

(async () => {
    // Retrieve environment variables or use defaults
    const siteUrl = process.env.SITE_URL || 'https://google.com';
    const username = process.env.USERNAME || null;
    const password = process.env.PASSWORD || null;
    const usernameField = process.env.USERNAME_FIELD || 'input[name="login"]';
    const passwordField = process.env.PASSWORD_FIELD || 'input[name="password"]';
    const submitButton = process.env.SUBMIT_BUTTON || 'input[name="submit"]';

    // Lighthouse configuration
    const categories = process.env.CATEGORIES
        ? process.env.CATEGORIES.split(',')
        : ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'];
    const platform = process.env.PLATFORM || 'both'; // desktop, mobile, or both
    const reportDir = process.env.REPORT_DIR || './reports';
    const reportType = process.env.REPORT_TYPE || 'html'; // html, json, csv (default: html)

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--remote-debugging-port=9222'],
    });

    const page = await browser.newPage();
    await page.goto(siteUrl);

    // Optional authentication
    if (username && password) {
        console.log('Performing authentication...');
        await page.type(usernameField, username);
        await page.type(passwordField, password);
        await page.click(submitButton);
        await page.waitForNavigation();
        console.log('Login successful!');
    } else {
        console.log('Skipping authentication as USERNAME or PASSWORD is not provided.');
    }

    // Function to run Lighthouse audit
    const runLighthouse = async (formFactor) => {
        console.log(`Running Lighthouse audit for ${formFactor} platform with ${reportType} output.`);
        const result = await lighthouse(page.url(), {
            port: new URL(browser.wsEndpoint()).port,
            output: reportType,
            onlyCategories: categories,
            formFactor,
            screenEmulation: {
                mobile: formFactor === 'mobile',
                width: formFactor === 'mobile' ? 375 : 1920,
                height: formFactor === 'mobile' ? 812 : 1080,
                deviceScaleFactor: formFactor === 'mobile' ? 3 : 1,
                disabled: false,
            },
        });

        const reportFile = path.join(reportDir, `lighthouse-report-${formFactor}.${reportType}`);
        await writeFile(reportFile, result.report);
        console.log(`Lighthouse ${formFactor} report saved to: ${reportFile}`);
    };

    // Run audits based on the selected platform
    if (platform === 'both' || platform === 'desktop') {
        await runLighthouse('desktop');
    }
    if (platform === 'both' || platform === 'mobile') {
        await runLighthouse('mobile');
    }

    await browser.close();
})();