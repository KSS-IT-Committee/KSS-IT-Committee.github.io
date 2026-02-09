# Docker Setup Guide

This repository includes Docker configurations for both development and production environments.

## Quick Start

### Development Mode (with hot reload)

To start the development server with hot reload and source mounting:

```bash
# Start the dev container
docker-compose -f docker-compose.dev.yml up nextjs-dev

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d nextjs-dev
```

The development server will be available at http://localhost:3000

**Features:**
- Hot reload enabled - changes to source files are immediately reflected
- Source files are mounted as volumes (not copied)
- SQLite data persists in a Docker volume
- Full development dependencies available

### Production Mode (optimized build)

To start the production server with an optimized build:

```bash
# Start the prod container
docker-compose -f docker-compose.dev.yml up nextjs-prod

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d nextjs-prod
```

The production server will be available at http://localhost:3001

**Features:**
- Multi-stage build for smaller image size
- Production-only dependencies
- Pre-built `.next` output
- Fast startup time
- No build toolchains in runtime image

## Docker Files Overview

### Dockerfiles

- **`docker/next.js-dev/Dockerfile`**: Development image with all dev dependencies
- **`docker/next.js-prod/Dockerfile`**: Production image with multi-stage build

### Docker Compose Files

- **`docker-compose.dev.yml`**: Local development and testing setup
  - `nextjs-dev`: Development server on port 3000
  - `nextjs-prod`: Production server on port 3001
- **`docker-compose.yml`**: Production deployment setup with load balancing

## Available Commands

```bash
# Build images
docker-compose -f docker-compose.dev.yml build

# Start services
docker-compose -f docker-compose.dev.yml up

# Start services in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop services and remove volumes
docker-compose -f docker-compose.dev.yml down -v
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

### Changes not reflecting
For development mode:
- Ensure you're using `docker-compose.dev.yml` with volume mounts
- Check that Next.js dev server is running (logs should show "ready on port 3000")
- Verify your editor isn't writing files in a way that breaks file watching

### Database issues
SQLite data is stored in Docker volumes:
- Dev data: `dev-data` volume
- Prod data: `prod-data` volume

To reset the database:
```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Production Deployment

For production deployment with load balancing, use the main `docker-compose.yml` file. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.
