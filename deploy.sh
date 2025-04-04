#!/bin/bash

# SaaS Template Deployment Script
# This script automates the deployment of the SaaS template application
# with automatic SSL certificate provisioning via Let's Encrypt

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   SaaS Template Deployment Script      ${NC}"
echo -e "${GREEN}=========================================${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}Please log out and log back in to use Docker without sudo.${NC}"
    echo -e "${YELLOW}After logging back in, run this script again.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    
    # Generate random passwords and secrets
    MONGO_PASSWORD=$(openssl rand -base64 16)
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Prompt for domain name
    read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
    
    # Prompt for email for Let's Encrypt
    read -p "Enter your email address (for Let's Encrypt): " EMAIL
    
    # Prompt for Stripe keys
    read -p "Enter your Stripe Secret Key: " STRIPE_SECRET_KEY
    read -p "Enter your Stripe Webhook Secret: " STRIPE_WEBHOOK_SECRET
    
    # Create .env file
    cat > .env << EOF
# Domain configuration
DOMAIN_NAME=${DOMAIN_NAME}
LETSENCRYPT_EMAIL=${EMAIL}

# MongoDB configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=${MONGO_PASSWORD}

# JWT configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Stripe configuration
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}

# Node environment
NODE_ENV=production
EOF
    
    echo -e "${GREEN}.env file created successfully.${NC}"
else
    echo -e "${YELLOW}.env file already exists. Using existing configuration.${NC}"
fi

# Check if docker-compose.yml exists
if [ ! -f docker-compose.yml ]; then
    echo -e "${YELLOW}Creating docker-compose.yml file...${NC}"
    
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  traefik:
    image: traefik:v2.9
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/acme.json:/acme.json
      - ./traefik/traefik.yml:/traefik.yml
    networks:
      - app-network
    depends_on:
      - setup

  setup:
    image: alpine:latest
    command: sh -c "mkdir -p /traefik && touch /traefik/acme.json && chmod 600 /traefik/acme.json"
    volumes:
      - ./traefik:/traefik

  mongodb:
    image: mongo:latest
    restart: always
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    networks:
      - app-network
    labels:
      - "traefik.enable=false"

  server:
    build: ./server
    restart: always
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=${NODE_ENV}
      - PORT=5000
      - DATABASE_URI=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/saas-template?authSource=admin
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
      - JWT_COOKIE_EXPIRES_IN=${JWT_COOKIE_EXPIRES_IN}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - CORS_ORIGIN=https://${DOMAIN_NAME}
      - CLIENT_ORIGIN=https://${DOMAIN_NAME}
    networks:
      - app-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.server.rule=Host(`${DOMAIN_NAME}`) && PathPrefix(`/api`)"
      - "traefik.http.routers.server.entrypoints=websecure"
      - "traefik.http.routers.server.tls.certresolver=letsencrypt"
      - "traefik.http.services.server.loadbalancer.server.port=5000"

  client:
    build:
      context: ./client
      args:
        - REACT_APP_API_URL=https://${DOMAIN_NAME}/api
    restart: always
    depends_on:
      - server
    networks:
      - app-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.client.rule=Host(`${DOMAIN_NAME}`)"
      - "traefik.http.routers.client.entrypoints=websecure"
      - "traefik.http.routers.client.tls.certresolver=letsencrypt"
      - "traefik.http.services.client.loadbalancer.server.port=80"

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
EOF
    
    echo -e "${GREEN}docker-compose.yml file created successfully.${NC}"
else
    echo -e "${YELLOW}docker-compose.yml file already exists. Using existing configuration.${NC}"
fi

# Create Traefik configuration
mkdir -p traefik
if [ ! -f traefik/traefik.yml ]; then
    echo -e "${YELLOW}Creating Traefik configuration...${NC}"
    
    cat > traefik/traefik.yml << EOF
api:
  dashboard: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: \${LETSENCRYPT_EMAIL}
      storage: acme.json
      httpChallenge:
        entryPoint: web
EOF
    
    # Create empty acme.json file with correct permissions
    touch traefik/acme.json
    chmod 600 traefik/acme.json
    
    echo -e "${GREEN}Traefik configuration created successfully.${NC}"
else
    echo -e "${YELLOW}Traefik configuration already exists. Using existing configuration.${NC}"
fi

# Create Dockerfile for server if it doesn't exist
if [ ! -f server/Dockerfile ]; then
    echo -e "${YELLOW}Creating Dockerfile for server...${NC}"
    
    cat > server/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
EOF
    
    echo -e "${GREEN}Server Dockerfile created successfully.${NC}"
else
    echo -e "${YELLOW}Server Dockerfile already exists. Using existing configuration.${NC}"
fi

# Create Dockerfile for client if it doesn't exist
if [ ! -f client/Dockerfile ]; then
    echo -e "${YELLOW}Creating Dockerfile for client...${NC}"
    
    cat > client/Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app

# Add build argument for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
    
    echo -e "${GREEN}Client Dockerfile created successfully.${NC}"
else
    echo -e "${YELLOW}Client Dockerfile already exists. Using existing configuration.${NC}"
fi

# Create Nginx configuration for client if it doesn't exist
if [ ! -f client/nginx.conf ]; then
    echo -e "${YELLOW}Creating Nginx configuration for client...${NC}"
    
    cat > client/nginx.conf << 'EOF'
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
EOF
    
    echo -e "${GREEN}Nginx configuration created successfully.${NC}"
else
    echo -e "${YELLOW}Nginx configuration already exists. Using existing configuration.${NC}"
fi

# Start the application
echo -e "${GREEN}Starting the application...${NC}"
docker-compose up -d

# Check if the application started successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}   Deployment completed successfully!    ${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${YELLOW}Your application is now running at:${NC}"
    echo -e "${GREEN}https://$(grep DOMAIN_NAME .env | cut -d '=' -f2)${NC}"
    echo -e "${YELLOW}It may take a few minutes for Let's Encrypt to issue the SSL certificate.${NC}"
    echo -e "${YELLOW}MongoDB credentials are stored in the .env file.${NC}"
else
    echo -e "${RED}Deployment failed. Please check the logs for more information.${NC}"
    echo -e "${YELLOW}You can view the logs with: docker-compose logs${NC}"
fi
