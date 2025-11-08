#!/bin/bash

# Zero-downtime rolling deployment script
# This script updates Next.js instances one at a time to ensure no downtime

set -e

echo "🚀 Starting zero-downtime rolling deployment..."

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a service is healthy
check_health() {
  local service=$1
  local max_attempts=30
  local attempt=0

  echo -e "${YELLOW}Waiting for $service to be healthy...${NC}"

  while [ $attempt -lt $max_attempts ]; do
    health_status=$(docker inspect --format='{{.State.Health.Status}}' $service 2>/dev/null || echo "not_running")

    if [ "$health_status" = "healthy" ]; then
      echo -e "${GREEN}✓ $service is healthy${NC}"
      return 0
    fi

    attempt=$((attempt + 1))
    echo "Attempt $attempt/$max_attempts - Status: $health_status"
    sleep 10
  done

  echo -e "${RED}✗ $service failed to become healthy${NC}"
  return 1
}

# Build new images
echo -e "${YELLOW}Building new Docker images...${NC}"
docker compose build

# Update nextjs-1
echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Updating nextjs-1 (nextjs-2 handles traffic)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

docker compose up -d --no-deps --build nextjs-1

if check_health "KSS-IT-Committee-HP-nextjs-1"; then
  echo -e "${GREEN}✓ nextjs-1 updated successfully${NC}"
else
  echo -e "${RED}✗ nextjs-1 update failed, rolling back...${NC}"
  docker compose restart nextjs-1
  exit 1
fi

# Wait a bit before updating the second instance
echo -e "\n${YELLOW}Waiting 10 seconds before updating nextjs-2...${NC}"
sleep 10

# Update nextjs-2
echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Updating nextjs-2 (nextjs-1 handles traffic)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

docker compose up -d --no-deps --build nextjs-2

if check_health "KSS-IT-Committee-HP-nextjs-2"; then
  echo -e "${GREEN}✓ nextjs-2 updated successfully${NC}"
else
  echo -e "${RED}✗ nextjs-2 update failed, rolling back...${NC}"
  docker compose restart nextjs-2
  exit 1
fi

# Restart nginx to ensure it picks up any changes
echo -e "\n${YELLOW}Restarting nginx...${NC}"
docker compose restart nginx

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Rolling deployment completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\nBoth instances are now running the latest version."
echo -e "Nginx is load balancing traffic between them.\n"
