FROM node:20-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

EXPOSE 3000

# Dev mode with hot reload — mount source as volume for live changes
CMD ["npm", "run", "dev"]
