FROM node:20-alpine

WORKDIR /app

# Install wget for health checks and build dependencies for native modules
RUN apk add --no-cache wget python3 make g++

# Create data directory for SQLite database
RUN mkdir -p /app/data && chmod 755 /app/data

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Uninstall unnecessary packages
RUN apk del python3 make g++

# Copy source files as default (volume mount overrides for live changes)
COPY src/ ./src/
COPY public/ ./public/
COPY next.config.ts ./
COPY tsconfig.json ./
COPY next-env.d.ts ./
COPY eslint.config.mjs ./

EXPOSE 3000

# Dev mode with hot reload — mount source as volume for live changes
CMD ["npm", "run", "dev"]
