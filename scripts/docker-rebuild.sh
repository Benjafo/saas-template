#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any running containers
echo "Stopping any running containers..."
docker-compose down

# Rebuild the containers
echo "Rebuilding containers..."
docker-compose build

# Start the containers
echo "Starting containers..."
docker-compose up -d

# Wait for the containers to start
echo "Waiting for containers to start..."
sleep 5

# Check if the containers are running
if docker-compose ps | grep -q "Up"; then
    echo "Containers are running successfully."
    echo "You can access the application at:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:5000"
    echo ""
    echo "To view logs, run: docker-compose logs -f"
    echo "To stop the containers, run: docker-compose down"
else
    echo "There was an issue starting the containers. Please check the logs with: docker-compose logs"
fi
