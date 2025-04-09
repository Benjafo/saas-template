# Development Environment with Hot Reloading

This document explains how to use the development Docker configuration with hot reloading.

## Overview

The development configuration (`docker-compose.dev.yml` and `client/Dockerfile.dev`) is set up to enable hot reloading for both the client and server. This means:

- Changes to React components will be reflected immediately in the browser
- Changes to server code will automatically restart the server
- No need to rebuild containers when making code changes

## How to Start the Development Environment

### Using Docker Compose

Run the following command from the project root:

```bash
# For Linux/Mac
docker-compose -f docker-compose.dev.yml up --build

# For Windows
docker-compose -f docker-compose.dev.yml up --build
```

This will:
1. Build the containers if needed
2. Start MongoDB, server, and client services
3. Mount your local source code as volumes
4. Enable hot reloading for both client and server

## Key Features

### Client (React Frontend)

- Uses React's built-in development server with hot module replacement
- Source code is mounted as a volume, so changes are reflected immediately
- Environment variables are set for proper hot reloading:
  - `CHOKIDAR_USEPOLLING=true` - Ensures file changes are detected
  - `WDS_SOCKET_PORT=0` - Helps with WebSocket connections in Docker

### Server (Node.js Backend)

- Uses nodemon to watch for file changes and restart automatically
- Source code is mounted as a volume
- `CHOKIDAR_USEPOLLING=true` ensures file changes are detected

## Stopping the Environment

Press `Ctrl+C` in the terminal where docker-compose is running, or run:

```bash
docker-compose -f docker-compose.dev.yml down
```

## Troubleshooting

If hot reloading isn't working:

1. Ensure the containers are running with the development configuration
2. Check that the volumes are mounted correctly
3. Verify that the CHOKIDAR_USEPOLLING environment variable is set to true
4. For the client, try refreshing the browser manually once

## Differences from Production

The development configuration differs from production in these key ways:

1. Client runs in development mode with React's dev server instead of a production build
2. Source code is mounted as volumes instead of being copied into the containers
3. Hot reloading is enabled for both client and server
