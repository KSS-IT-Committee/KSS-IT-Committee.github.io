# Docker Setup Guide

This repository includes Docker configurations for both development and production environments.

## Quick Start

### Environment Variables

To use `.env.local` with Docker containers:

```bash
# 1. Create your .env.local file
echo "POSTGRES_URL=your-postgres-connection-string" > .env.local

# 2. Copy the override example
cp docker-compose.override.example.yml docker-compose.override.yml

# 3. Start containers (override is automatically applied)
docker compose up
```

The `docker-compose.override.yml` file is in `.gitignore` and won't be committed, keeping your secrets safe.

### Development Mode (with hot reload)

To start the development server with hot reload and source mounting:

```bash
# Start the dev container (pulls pre-built image from GHCR)
docker compose up nextjs-dev

# Or run in detached mode
docker compose up -d nextjs-dev
```

The development server will be available at http://localhost:3000

**Features:**
- Hot reload enabled - changes to source files are immediately reflected
- Source files are mounted as volumes (not copied)
- Full development dependencies available
- Pulls pre-built images from GHCR

### Production Mode (build on start)

To start the production server:

```bash
# Start the prod container (pulls pre-built image from GHCR)
docker compose up nextjs-prod

# Or run in detached mode
docker compose up -d nextjs-prod
```

The production server will be available at http://localhost:3001

**Features:**
- Builds on container start (first start is slower)
- All dependencies included for building
- Pulls pre-built images from GHCR

**Build Cache Behavior:**
- First start: Runs `npm run build` (~1-2 minutes depending on project size)
- Subsequent starts: Reuses cached `.next` if source files unchanged (~10 seconds)
- After code changes: Rebuild required, but incremental (faster than first build)

## Docker Files Overview

### Dockerfiles

- **`docker/next.js/Dockerfile`**: Base Next.js image for production deployment
- **`docker/next.js-dev/Dockerfile`**: Development image with all dev dependencies
- **`docker/next.js-prod/Dockerfile`**: Production image that builds on container start

### Docker Compose Files

- **`docker-compose.yml`**: Development and testing setup
  - `nextjs-dev`: Development server on port 3000
  - `nextjs-prod`: Production server on port 3001 (builds on start)
  - Both services pull pre-built images from GHCR
- **`docker-compose.override.example.yml`**: Example override for mounting `.env.local`

## Available Commands

```bash
# Build images (when using local Dockerfile builds)
docker compose build

# Start services
docker compose up

# Start services in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop services and remove volumes
docker compose down -v

# Rebuild from scratch (clears cache)
docker compose down -v
docker compose build --no-cache
docker compose up
```

## CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/docker-build.yml`) that:

1. Builds both dev and prod Docker images
2. Tags images with branch name, PR number, commit SHA, and `latest` (for main branch)
3. Pushes images to GitHub Container Registry (GHCR)

Images are published to:
- `ghcr.io/kss-it-committee/kss-it-committee.github.io-dev:latest`
- `ghcr.io/kss-it-committee/kss-it-committee.github.io-prod:latest`

## Troubleshooting

### Port already in use
If you get a port conflict error, either:
- Stop the conflicting service
- Change the port mapping in `docker-compose.yml` (e.g., `"3002:3000"`)

### Changes not reflecting in production mode
For production mode, to rebuild after code changes:
```bash
# Option 1: Restart the container (will rebuild)
docker compose restart nextjs-prod

# Option 2: Recreate the container
docker compose up -d --force-recreate nextjs-prod
```

### Changes not reflecting in development mode
For development mode:
- Check that Next.js dev server is running (logs should show "ready on port 3000")
- Verify your editor isn't writing files in a way that breaks file watching

### .env.local not being recognized
If your `.env.local` file isn't being picked up:
1. Ensure you've created `docker-compose.override.yml` from the example:
   ```bash
   cp docker-compose.override.example.yml docker-compose.override.yml
   ```
2. Verify `.env.local` exists in the repository root
3. Restart the container: `docker compose restart`
4. Check logs for environment variable loading

## Production Deployment

For production deployment with load balancing, see [DEPLOYMENT.md](../DEPLOYMENT.md) for details.
