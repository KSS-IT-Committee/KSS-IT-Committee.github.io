# Base stage with build dependencies
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++

# Stage 1: Dependencies (all dependencies for building)
FROM base AS deps-build
COPY package*.json ./
RUN npm ci

# Stage 2: Production dependencies only
FROM node:20-alpine AS deps-prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 3: Builder
FROM base AS builder
# Copy dependencies from build stage (includes devDependencies needed for build)
COPY --from=deps-build /app/node_modules ./node_modules

# Copy source files
COPY src/ ./src/
COPY public/ ./public/
COPY next.config.ts ./
COPY tsconfig.json ./
COPY next-env.d.ts ./
COPY eslint.config.mjs ./
COPY package*.json ./

# Build the Next.js application
RUN npm run build

# Stage 4: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install wget for health checks only
RUN apk add --no-cache wget

# Create data directory for SQLite database
RUN mkdir -p /app/data && chmod 755 /app/data

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production dependencies from dedicated stage
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=deps-prod /app/package*.json ./

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Set proper permissions
RUN chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js production server
CMD ["npm", "run", "start"]
