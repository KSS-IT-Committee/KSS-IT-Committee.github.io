# Docker Setup Guide

This repository includes Docker configurations for both development and production environments.

## Quick Start

### Environment Variables

Both dev and prod containers support `.env.local` for environment variables:

```bash
# Optional: Create .env.local file with your environment variables
touch .env.local
echo "DATABASE_URL=your-database-url" >> .env.local
```

The file will be automatically mounted as read-only if it exists.

### Development Mode (with hot reload)

To start the development server with hot reload and source mounting:

```bash
# Start the dev container
docker compose -f docker-compose.dev.yml up nextjs-dev

# Or run in detached mode
docker compose -f docker-compose.dev.yml up -d nextjs-dev
```

The development server will be available at http://localhost:3000

**Features:**
- Hot reload enabled - changes to source files are immediately reflected
- Source files are mounted as volumes (not copied)
- SQLite data persists in a Docker volume
- Full development dependencies available
- `.env.local` mounted if available

### Production Mode (build on start with cache)

To start the production server:

```bash
# Start the prod container
docker compose -f docker-compose.dev.yml up nextjs-prod

# Or run in detached mode
docker compose -f docker-compose.dev.yml up -d nextjs-prod
```

The production server will be available at http://localhost:3001

**Features:**
- Builds on container start (first start is slower)
- `.next` directory cached in volume (subsequent starts are faster)
- All dependencies included for building
- `.env.local` mounted if available

**Build Cache Behavior:**
- First start: Runs `npm run build` (~1-2 minutes depending on project size)
- Subsequent starts: Reuses cached `.next` if source files unchanged (~10 seconds)
- After code changes: Rebuild required, but incremental (faster than first build)

## Docker Files Overview

### Dockerfiles

- **`docker/next.js-dev/Dockerfile`**: Development image with all dev dependencies
- **`docker/next.js-prod/Dockerfile`**: Production image that builds on container start

### Docker Compose Files

- **`docker-compose.dev.yml`**: Local development and testing setup
  - `nextjs-dev`: Development server on port 3000
  - `nextjs-prod`: Production server on port 3001 (builds on start, caches build)
- **`docker-compose.yml`**: Production deployment setup with load balancing

## Available Commands

```bash
# Build images
docker compose -f docker-compose.dev.yml build

# Start services
docker compose -f docker-compose.dev.yml up

# Start services in background
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop services
docker compose -f docker-compose.dev.yml down

# Stop services and remove volumes (including build cache)
docker compose -f docker-compose.dev.yml down -v

# Rebuild from scratch (clears cache)
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

## CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/docker-build.yml`) that:

1. Builds both dev and prod Docker images
2. Tags images with branch name, PR number, commit SHA, and `latest` (for main branch)
3. Pushes images to GitHub Container Registry (GHCR) on push events
4. Skips pushing on pull requests (build-only validation)

Images are published to:
- `ghcr.io/kss-it-committee/kss-it-committee.github.io-dev:latest`
- `ghcr.io/kss-it-committee/kss-it-committee.github.io-prod:latest`

## Troubleshooting

### Port already in use
If you get a port conflict error, either:
- Stop the conflicting service
- Change the port mapping in `docker-compose.dev.yml` (e.g., `"3002:3000"`)

### Changes not reflecting in production mode
For production mode, the build is cached in a volume. To rebuild after code changes:
```bash
# Option 1: Restart the container (will rebuild if needed)
docker compose -f docker-compose.dev.yml restart nextjs-prod

# Option 2: Clear the cache and rebuild
docker compose -f docker-compose.dev.yml down
docker volume rm kss-it-committee-github-io_prod-next-cache
docker compose -f docker-compose.dev.yml up nextjs-prod
```

### Changes not reflecting in development mode
For development mode:
- Ensure you're using `docker-compose.dev.yml` with volume mounts
- Check that Next.js dev server is running (logs should show "ready on port 3000")
- Verify your editor isn't writing files in a way that breaks file watching

### Database issues
SQLite data is stored in Docker volumes:
- Dev data: `dev-data` volume
- Prod data: `prod-data` volume
- Prod build cache: `prod-next-cache` volume

To reset the database:
```bash
docker compose -f docker-compose.dev.yml down -v
```

### .env.local not being recognized
If your `.env.local` file isn't being picked up:
1. Ensure the file exists in the repository root
2. Restart the container: `docker compose -f docker-compose.dev.yml restart`
3. Check file permissions (should be readable)

## Production Deployment

For production deployment with load balancing, use the main `docker-compose.yml` file. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.
