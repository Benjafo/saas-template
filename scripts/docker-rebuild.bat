@echo off
echo Docker Rebuild for SaaS Template
echo ==============================

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

REM Stop any running containers
echo Stopping any running containers...
docker-compose down

REM Rebuild the containers
echo Rebuilding containers...
docker-compose build

REM Start the containers
echo Starting containers...
docker-compose up -d

REM Wait for the containers to start
echo Waiting for containers to start...
timeout /t 5 /nobreak >nul

REM Check if the containers are running
docker-compose ps | findstr "Up" >nul
if %ERRORLEVEL% EQU 0 (
    echo Containers are running successfully.
    echo You can access the application at:
    echo - Frontend: http://localhost:3000
    echo - Backend API: http://localhost:5000
    echo.
    echo To view logs, run: docker-compose logs -f
    echo To stop the containers, run: docker-compose down
) else (
    echo There was an issue starting the containers. Please check the logs with: docker-compose logs
)
