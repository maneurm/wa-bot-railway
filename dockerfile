FROM node:20

# Install Chromium
RUN apt-get update && apt-get install -y wget gnupg2
RUN apt-get install -y chromium

# Set env var so puppeteer can find Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Setup app
WORKDIR /app
COPY . .

RUN npm install

CMD ["npm", "start"]
