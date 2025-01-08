import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';
import lighthouse from 'lighthouse';
import dotenv from 'dotenv';
import path from 'path';

// Load .env variables
dotenv.config();

(async () => {
    // Retrieve environment variables or use defaults
    const initialUrl = process.env.SITE_URL || 'https://google.com';
    const username = process.env.USERNAME || null;
    const password = process.env.PASSWORD || null;
    const usernameField = process.env.USERNAME_FIELD || 'input[name="username"]';
    const passwordField = process.env.PASSWORD_FIELD || 'input[name="password"]';
    const submitButton = process.env.SUBMIT_BUTTON || 'button[name="action"]';

    // Lighthouse configuration
    const categories = process.env.CATEGORIES
        ? process.env.CATEGORIES.split(',')
        : ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'];
    const platform = process.env.PLATFORM || 'both'; // desktop, mobile, or both
    const reportDir = process.env.REPORT_DIR || './reports';
    const reportType = process.env.REPORT_TYPE || 'html'; // html, json, csv (default: html)

    const browser = await puppeteer.launch({
        headless: true, // Set to true for headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        // Initialize a new page
        const page = await browser.newPage();

        console.log(`Navigating to: ${initialUrl}`);
        await page.goto(initialUrl, { waitUntil: 'networkidle2' });

        console.log(`Redirected to: ${page.url()}`);

        // Check if credentials are provided
        if (username && password) {
            console.log('Credentials provided. Proceeding with login...');

            // Wait for login page to load
            await page.waitForSelector(usernameField, {
                timeout: 60000,
            });

            console.log('Login page detected.');

            // Fill in login credentials (generic selectors)
            await page.type(usernameField, username);
            await page.type(passwordField, password);

            // Submit the login form
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, submitButton);
            console.log('Login form submitted.');

            // Wait for navigation back to the target page
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
            console.log(`Successfully redirected to: ${page.url()}`);
        } else {
            console.log('No credentials provided. Skipping login process.');
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
    } catch (err) {
        console.error('Error during login flow:', err);
    } finally {
        await browser.close();
    }
})();