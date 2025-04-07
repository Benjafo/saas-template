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

# Stop the Docker containers
echo "Stopping Docker containers..."
docker-compose down

# Check if the containers are stopped
if docker-compose ps | grep -q "Up"; then
    echo "There was an issue stopping the containers. Please check the logs with: docker-compose logs"
else
    echo "Containers stopped successfully."
fi
