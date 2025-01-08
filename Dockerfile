# Use ARM-compatible Node.js base image
FROM --platform=linux/x86_64 node:20-slim

# Install dependencies for Puppeteer and Headless Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    libxcb1 \
    libxcomposite1 \
    libxrandr2 \
    libxi6 \
    libasound2 \
    fonts-liberation \
    libxdamage1 \
    libxfixes3 \
    libcups2 \
    libpango-1.0-0 \
    libcairo2 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install project dependencies
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm install
RUN npx puppeteer browsers install chrome
# Copy the rest of the application code
COPY . .

# Expose a port if needed (optional)
EXPOSE 9222

# Define the command to run your script
CMD ["node", "audit.js"]