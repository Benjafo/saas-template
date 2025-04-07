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

# Check if .env file exists, create it if it doesn't
if [ ! -f .env ]; then
    echo "Creating .env file with default values..."
    cat > .env << EOL
# MongoDB configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=password123

# JWT configuration
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Node environment
NODE_ENV=development

# Admin configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password_immediately
EOL
    echo ".env file created successfully."
fi

# Start the Docker containers
echo "Starting Docker containers..."
echo "Note: If you've made changes to docker-compose.yml, run 'docker-compose build' first."
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
