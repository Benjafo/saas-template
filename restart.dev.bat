@echo off

echo ====================================
echo === Removing existing containers ===
echo ====================================
docker-compose down

echo ===========================
echo === Building and running containers in development mode ===
echo ===========================
docker-compose -f docker-compose.dev.yml up --build

echo =====================
echo === Watching logs ===
echo =====================
docker-compose logs -f client