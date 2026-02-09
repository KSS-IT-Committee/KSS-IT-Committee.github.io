FROM node:20-alpine

WORKDIR /app

# Install wget for health checks and build dependencies for native modules
RUN apk add --no-cache wget python3 make g++

# Create data directory for SQLite database
RUN mkdir -p /app/data && chmod 755 /app/data

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source files as default (volume mount overrides for live changes)
COPY src/ ./src/
COPY public/ ./public/
COPY next.config.ts ./
COPY tsconfig.json ./
COPY next-env.d.ts ./
COPY eslint.config.mjs ./

EXPOSE 3000

# Production mode — build and start. Rebuild on container start to pick up mounted changes.
CMD ["sh", "-c", "npm run build && npm run start"]
