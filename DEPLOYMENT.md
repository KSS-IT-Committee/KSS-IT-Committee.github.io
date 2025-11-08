# Zero-Downtime Deployment Guide

This project uses a **rolling update strategy** with two Next.js instances behind an nginx load balancer for zero-downtime deployments.

## Architecture

```
              ┌──────────┐
   Internet → │  Nginx   │ (Load Balancer)
              └────┬─────┘
                   │
          ┌────────┴────────┐
          │                 │
    ┌─────▼─────┐    ┌─────▼─────┐
    │ nextjs-1  │    │ nextjs-2  │
    └───────────┘    └───────────┘
```

## How It Works

1. **Load Balancing**: Nginx distributes traffic between two Next.js instances using the `least_conn` algorithm
2. **Health Checks**: Each instance has health checks (every 10s)
3. **Rolling Updates**: Instances are updated one at a time
4. **Zero Downtime**: While one instance updates, the other serves all traffic

## Initial Setup

```bash
# Build and start all services
docker compose up -d --build

# Verify all services are healthy
docker compose ps
```

## Deploying Updates (Zero Downtime)

When you need to deploy content changes:

```bash
# Run the rolling deployment script
./deploy-rolling.sh
```

### What the script does:
1. ✅ Builds new Docker images
2. ✅ Updates `nextjs-1` while `nextjs-2` serves traffic
3. ✅ Waits for `nextjs-1` health check to pass
4. ✅ Updates `nextjs-2` while `nextjs-1` serves traffic
5. ✅ Waits for `nextjs-2` health check to pass
6. ✅ Restarts nginx to ensure proper routing
7. ✅ **Zero downtime throughout the process!**

## Manual Deployment (Advanced)

If you need more control:

```bash
# Update instance 1 only
docker compose up -d --no-deps --build nextjs-1

# Wait for health check
docker inspect --format='{{.State.Health.Status}}' KSS-IT-Committee-HP-nextjs-1

# Update instance 2 only
docker compose up -d --no-deps --build nextjs-2

# Restart nginx
docker compose restart nginx
```

## Monitoring

```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f nextjs-1
docker compose logs -f nextjs-2
docker compose logs -f nginx

# Check health status
docker inspect --format='{{.State.Health.Status}}' KSS-IT-Committee-HP-nextjs-1
docker inspect --format='{{.State.Health.Status}}' KSS-IT-Committee-HP-nextjs-2
```

## Rollback

If a deployment fails, the script will automatically attempt to rollback. For manual rollback:

```bash
# Restart the problematic instance
docker compose restart nextjs-1

# Or rebuild from previous image
docker compose up -d --no-deps nextjs-1
```

## Performance Tuning

### Nginx Load Balancing Algorithms

Current: `least_conn` (sends requests to instance with fewer connections)

Other options in `docker/nginx/default.conf`:
- `round_robin` (default, commented out) - alternates between instances
- `ip_hash` - same client always goes to same instance

### Health Check Tuning

In `docker compose.yml`, adjust:
- `interval`: How often to check (default: 10s)
- `timeout`: Max time to wait for response (default: 5s)
- `retries`: Failed checks before marking unhealthy (default: 3)
- `start_period`: Grace period for startup (default: 30s)

## Troubleshooting

### Instance stuck in "starting" state
```bash
docker compose logs nextjs-1
# Check build errors or startup issues
```

### Nginx not routing traffic
```bash
docker compose logs nginx
# Check upstream configuration
```

### Health checks failing
```bash
# Test health endpoint manually
docker exec KSS-IT-Committee-HP-nextjs-1 wget -O- http://localhost:3000/
```

## Production Checklist

Before deploying to production:

- [ ] Test deployment script in staging
- [ ] Verify health checks are working
- [ ] Monitor logs during first deployment
- [ ] Set up monitoring/alerting for health check failures
- [ ] Document rollback procedures for your team
- [ ] Consider adding automated tests before deployment
