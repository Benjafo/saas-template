# Docker Setup for SaaS Template

This document provides instructions for running the SaaS Template application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuration Files

The Docker setup consists of the following files:

- `docker-compose.yml` - Defines the services (MongoDB, server, client)
- `server/Dockerfile` - Instructions for building the server image
- `client/Dockerfile` - Instructions for building the client image
- `.env` - Environment variables for the Docker setup

## Running the Application

### Using the Startup Scripts

For convenience, startup scripts have been provided for both Windows and Unix-based systems:

#### Windows
1. Double-click the `docker-start.bat` file or run it from the command prompt:
   ```
   docker-start.bat
   ```

#### macOS/Linux
1. Make the script executable (if not already):
   ```bash
   chmod +x docker-start.sh
   ```
2. Run the script:
   ```bash
   ./docker-start.sh
   ```

These scripts will:
- Check if Docker and Docker Compose are installed
- Create a default .env file if one doesn't exist
- Start the Docker containers in detached mode
- Provide information about accessing the application

### Manual Startup

If you prefer to start the containers manually:

1. Make sure Docker and Docker Compose are installed on your system
2. Open a terminal in the project root directory
3. Run the following command:

```bash
docker-compose up
```

This will:
- Build the Docker images for your client and server
- Start MongoDB with the configured username and password
- Start the server with a connection to MongoDB
- Start the client with a connection to the server
- Map the necessary ports to your host machine

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017 (accessible with the credentials in your .env file)

## Useful Commands

### Using the Convenience Scripts

#### Starting the Application
- Windows: Run `docker-start.bat`
- macOS/Linux: Run `./docker-start.sh`

#### Stopping the Application
- Windows: Run `docker-stop.bat`
- macOS/Linux: Run `./docker-stop.sh`

#### Rebuilding the Application
If you've made changes to the Docker configuration or need to rebuild the containers:
- Windows: Run `docker-rebuild.bat`
- macOS/Linux: Run `./docker-rebuild.sh`

These rebuild scripts will:
1. Stop any running containers
2. Rebuild all container images
3. Start the containers again

### Manual Commands

- To run in detached mode (background):
  ```bash
  docker-compose up -d
  ```

- To stop the containers:
  ```bash
  docker-compose down
  ```

- To rebuild images after making changes to Dockerfiles:
  ```bash
  docker-compose build
  ```

- To view logs:
  ```bash
  docker-compose logs -f
  ```

- To seed the database:
  ```bash
  docker-compose exec server npm run seed
  ```

- To access the MongoDB shell:
  ```bash
  docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin saas-template
  ```

## Development Workflow

The Docker setup is configured for development with volume mounts that enable hot-reloading:

- Changes to server code will be automatically detected and the server will restart
- Changes to client code will be automatically detected and the browser will refresh

## Troubleshooting

### MongoDB Connection Issues

If the server can't connect to MongoDB, try:

1. Checking the MongoDB logs:
   ```bash
   docker-compose logs mongodb
   ```

2. Verifying the MongoDB credentials in the `.env` file match what's used in `docker-compose.yml`

3. Ensuring the MongoDB container is running:
   ```bash
   docker-compose ps
   ```

### Client-Server Connection Issues

If the client can't connect to the server API:

1. Verify the server is running:
   ```bash
   docker-compose ps
   ```

2. Check the server logs for errors:
   ```bash
   docker-compose logs server
   ```

3. Ensure the REACT_APP_API_URL environment variable in the client service is correctly set to http://server:5000/api (not localhost)

4. If you see "ECONNREFUSED" errors, make sure you're using service names for inter-container communication:
   - Client should connect to server using `http://server:5000/api`
   - Server should accept connections from client using `http://client:3000`

5. After making changes to environment variables, rebuild the containers:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up
   ```
