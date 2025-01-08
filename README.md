
# Lighthouse Desktop Audit with Puppeteer

This project automates a Lighthouse audit for desktop accessibility using Puppeteer for authentication and navigation. It generates an HTML report for accessibility analysis.

## Features
- Automates login to websites requiring authentication.
- Runs Lighthouse audits in desktop mode.
- Outputs an HTML accessibility report.

## Prerequisites
- [Node.js](https://nodejs.org) (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the source files:
   ```bash
   git clone https://github.com/sqerison/lighthouse-desktop-audit.git
   cd lighthouse-desktop-audit
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

1. **Configure the URL and Login Credentials**:
   Open `audit.js` and replace placeholders for website URL and your login credentials and selectors:
   ```javascript
   await page.goto('https://example.com');
   await page.type('input[name="replace-me-with-your-login-imput-name"]', 'your-username');
   await page.type('input[name="replace-me-with-your-password-imput-name"]', 'your-password');
   await page.click('input[name="submit"]'); // please also check whether the submit button has the same name and if not, please adjust.
   ```

2. **Run the Audit**:
   Start the script:
   ```bash
   npm start
   ```

3. **View the Report**:
   After the audit completes, an HTML report will be generated in the project directory:
   ```
   lighthouse-report.html
   ```

## Configuration

### Lighthouse Settings
The Lighthouse audit is configured to run in desktop mode with the following parameters:
- Screen dimensions: 1920x1080
- Categories: Accessibility

If you wish to customize these settings, edit the configuration in `audit.js`:
```javascript
const result = await lighthouse.default(page.url(), {
    port: new URL(browser.wsEndpoint()).port,
    output: 'html',
    onlyCategories: ['accessibility'],
    formFactor: 'desktop',
    screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        disabled: false,
    },
});
```

## Dependencies
- [Puppeteer](https://github.com/puppeteer/puppeteer) - For browser automation.
- [Lighthouse](https://github.com/GoogleChrome/lighthouse) - For auditing.

## Troubleshooting

1. **Error: `ERR_REQUIRE_ESM`**:
   Ensure you are using ES Modules by setting `"type": "module"` in `package.json`.

2. **Login Fails**:
   - Verify the username and password are correct.
   - Update the selectors for the login fields if they change.

3. **Report Not Generated**:
   - Ensure the URL used after login is correct.
   - Check for any errors in the console during execution.

## License
This project is licensed under the MIT License.

## Contributing
Feel free to submit issues or pull requests to improve this tool.

## Contact
For further inquiries, please contact [Your Email] or open an issue in the repository.
