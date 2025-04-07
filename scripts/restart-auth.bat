@echo off
echo ===== Authentication Fix Script =====
echo This script will restart the application with the updated authentication configuration.

echo 1. Stopping existing containers...
docker-compose down

echo 2. Removing any dangling volumes...
docker volume prune -f

echo 3. Rebuilding containers with updated authentication configuration...
docker-compose build --no-cache

echo 4. Starting containers...
docker-compose up -d

echo 5. Waiting for services to start...
timeout /t 5 /nobreak > nul

echo 6. Checking container status...
docker-compose ps

echo 7. Showing logs...
echo Press Ctrl+C to exit logs (containers will continue running)
docker-compose logs -f
