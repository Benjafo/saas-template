@echo off

echo === Light Refresh ===

docker-compose down
docker-compose build
docker-compose up -d
docker-compose logs -f client