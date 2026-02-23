FROM node:20-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Copy package files and install all dependencies (needed for building)
COPY package*.json ./
RUN npm ci

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Source files are mounted via docker-compose volumes
# Build and start
CMD ["sh", "-c", "npm run build && npm run start"]
