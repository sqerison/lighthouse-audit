
# Lighthouse Audit with Puppeteer

This project automates Lighthouse audits for both mobile and desktop platforms using Puppeteer. It supports optional authentication, dynamic platform selection, and configurable report formats. The reports are stored in a `reports` directory, which is mounted as a Docker volume.

## Features
- Run Lighthouse audits for mobile, desktop, or both platforms.
- Optional login support using credentials.
- Customizable Lighthouse categories for audits.
- Configurable report formats: HTML (default), JSON, or CSV.
- Saves reports in a mounted `reports` folder.

## Prerequisites
- [Docker](https://www.docker.com) installed on your machine.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lighthouse-audit.git
   cd lighthouse-audit
   ```

2. Build the Docker image:
   ```bash
   docker build -t lighthouse-audit .
   ```

## Usage

### Run Without Authentication
To run the audit without login credentials:
```bash
docker run --rm \
  -v $(pwd)/reports:/usr/src/app/reports \
  -e SITE_URL="https://google.com" \
  lighthouse-audit
```

### Run With Authentication
To run the audit with login credentials:
```bash
docker run --rm \
  -v $(pwd)/reports:/usr/src/app/reports \
  -e SITE_URL="https://google.com" \
  -e USERNAME="your-username" \
  -e PASSWORD="your-password" \
  -e USERNAME_FIELD="input[name='login']" \
  -e PASSWORD_FIELD="input[name='password']" \
  -e SUBMIT_BUTTON="input[name='submit']" \
  lighthouse-audit
```

### Run for Specific Platforms
By default, the audit runs for both mobile and desktop. To specify a platform:
- **Desktop only**:
  ```bash
  docker run --rm \
    -v $(pwd)/reports:/usr/src/app/reports \
    -e SITE_URL="https://example.com"  \
    -e PLATFORM="desktop" \
    lighthouse-audit
  ```

- **Mobile only**:
  ```bash
  docker run --rm \
    -v $(pwd)/reports:/usr/src/app/reports \
    -e SITE_URL="https://example.com" \
    -e PLATFORM="mobile" \
    lighthouse-audit
  ```

### Run With Custom Categories
To customize Lighthouse categories, use the `CATEGORIES` environment variable:
```bash
docker run --rm \
  -v $(pwd)/reports:/usr/src/app/reports \
  -e SITE_URL="https://example.com" \
  -e CATEGORIES="performance,accessibility" \
  lighthouse-audit
```

### Generate Reports in Specific Formats
The default report format is `html`. Other types could be specified as: `html`, `json`, `csv`.
To specify a different format:
- **JSON Report**:
  ```bash
  docker run --rm \
    -v $(pwd)/reports:/usr/src/app/reports \
  -e SITE_URL="https://example.com" \
  -e REPORT_TYPE="json" \
  lighthouse-audit
  ```

## Configuration

### Environment Variables

| Variable        | Default Value              | Description                                      |
|------------------|----------------------------|--------------------------------------------------|
| `SITE_URL`       | `https://google.com`       | URL to audit (login or main page).              |
| `USERNAME`       | None                       | Username for login (optional).                  |
| `PASSWORD`       | None                       | Password for login (optional).                  |
| `USERNAME_FIELD` | `input[name='login']`      | Selector for the username field.                |
| `PASSWORD_FIELD` | `input[name='password']`   | Selector for the password field.                |
| `SUBMIT_BUTTON`  | `input[name='submit']`     | Selector for the login button.                  |
| `CATEGORIES`     | All categories             | Comma-separated list of categories to audit.    |
| `PLATFORM`       | `both`                     | Platform to audit: `mobile`, `desktop`, or `both`. |
| `REPORT_TYPE`    | `html`                     | Report format: `html`, `json`, or `csv`.        |
| `REPORT_DIR`     | `./reports`                | Directory to save the Lighthouse report.        |

### Lighthouse Categories
- `performance`: Page load speed and efficiency.
- `accessibility`: Compliance with web accessibility best practices.
- `best-practices`: Web development best practices.
- `seo`: Search engine optimization.
- `pwa`: Progressive Web App standards.

## Output

Reports are saved in the `reports` folder with filenames based on the platform and format:
- `lighthouse-report-desktop.html`
- `lighthouse-report-mobile.html`
- `lighthouse-report-desktop.json`
- `lighthouse-report-mobile.csv`
(Depending on the `REPORT_TYPE` specified.)

Ensure the `reports` folder is mounted as a Docker volume for easy access.

## License
This project is licensed under the MIT License.

## Contact
For inquiries or issues, please contact [volodymyr@apprecode.com](mailto:volodymyr@apprecode.com) or open an issue in the repository.
