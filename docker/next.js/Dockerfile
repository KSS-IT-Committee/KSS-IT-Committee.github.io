FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files (will be overridden by volumes in dev)
COPY . .

# The build command will be run by docker-compose