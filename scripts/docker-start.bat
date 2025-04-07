@echo off
echo Docker Setup for SaaS Template
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

REM Check if .env file exists, create it if it doesn't
if not exist .env (
    echo Creating .env file with default values...
    (
        echo # MongoDB configuration
        echo MONGO_USERNAME=admin
        echo MONGO_PASSWORD=password123
        echo.
        echo # JWT configuration
        echo JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
        echo JWT_EXPIRES_IN=90d
        echo JWT_COOKIE_EXPIRES_IN=90
        echo.
        echo # Node environment
        echo NODE_ENV=development
        echo.
        echo # Admin configuration
        echo ADMIN_EMAIL=admin@example.com
        echo ADMIN_PASSWORD=change_this_password_immediately
    ) > .env
    echo .env file created successfully.
)

REM Start the Docker containers
echo Starting Docker containers...
echo Note: If you've made changes to docker-compose.yml, run 'docker-compose build' first.
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
