FROM node:18-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm ci

# Copy all necessary files
COPY src/ ./src/
COPY public/ ./public/
COPY next.config.ts ./
COPY tsconfig.json ./
COPY next-env.d.ts ./
COPY eslint.config.mjs ./

# Build the Next.js app (this will be done in docker-compose command)
# RUN npm run build

EXPOSE 3000

# The build and start command will be run by docker-compose
CMD ["npm", "run", "start"]