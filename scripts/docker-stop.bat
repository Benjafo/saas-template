@echo off
echo Docker Stop for SaaS Template
echo ============================

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Stop the Docker containers
echo Stopping Docker containers...
docker-compose down

REM Check if the containers are stopped
docker-compose ps | findstr "Up" >nul
if %ERRORLEVEL% EQU 0 (
    echo There was an issue stopping the containers. Please check the logs with: docker-compose logs
) else (
    echo Containers stopped successfully.
)
