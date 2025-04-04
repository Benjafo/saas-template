# SaaS Template Deployment Guide

This guide provides instructions for deploying the SaaS template application using Ansible. The deployment process will:

1. Install all required components (Docker, Docker Compose)
2. Set up the application with proper configuration
3. Configure SSL certificates using Let's Encrypt
4. Start the server and client

## Prerequisites

- A server running Ubuntu (preferably 20.04 LTS or newer)
- A domain name pointing to your server's IP address
- Ansible installed on your local machine

## Installation Steps

### 1. Install Ansible (on your local machine)

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install ansible

# For macOS (using Homebrew)
brew install ansible

# For Windows
# Install WSL2 with Ubuntu, then follow Ubuntu instructions
```

### 2. Configure the Inventory File

Edit the `inventory.ini` file to add your server's IP address or hostname:

```ini
[webservers]
your-server-ip-or-hostname

[webservers:vars]
ansible_user=ubuntu
# Uncomment and modify the following lines as needed
# ansible_ssh_private_key_file=~/.ssh/id_rsa
# ansible_become=yes
# ansible_become_method=sudo
```

### 3. Run the Ansible Playbook

```bash
ansible-playbook -i inventory.ini deploy.yml
```

During the playbook execution, you will be prompted to enter:
- Your domain name (e.g., example.com)
- Your email address (for Let's Encrypt)
- Your Stripe Secret Key
- Your Stripe Webhook Secret

### 4. Access Your Application

Once the deployment is complete, you can access your application at:

```
https://your-domain.com
```

It may take a few minutes for Let's Encrypt to issue the SSL certificate.

## Deployment Architecture

The deployment uses Docker Compose with the following services:

- **Traefik**: Reverse proxy with automatic SSL certificate management
- **MongoDB**: Database for the application
- **Server**: Node.js/Express backend API
- **Client**: React frontend application

## Environment Variables

The following environment variables are automatically generated and configured:

- **MONGO_USERNAME**: MongoDB username (default: admin)
- **MONGO_PASSWORD**: Randomly generated MongoDB password
- **JWT_SECRET**: Randomly generated JWT secret key
- **JWT_EXPIRES_IN**: JWT token expiration (default: 90d)
- **JWT_COOKIE_EXPIRES_IN**: JWT cookie expiration (default: 90)

## Maintenance

### Updating the Application

To update the application, make your changes to the codebase and run the playbook again:

```bash
ansible-playbook -i inventory.ini deploy.yml
```

### Viewing Logs

To view logs for any service, SSH into your server and run:

```bash
cd /opt/saas-template
docker-compose logs -f [service_name]
```

Where `[service_name]` can be `client`, `server`, `mongodb`, or `traefik`.

### Backing Up the Database

To back up the MongoDB database, SSH into your server and run:

```bash
cd /opt/saas-template
docker-compose exec mongodb mongodump --username ${MONGO_USERNAME} --password ${MONGO_PASSWORD} --authenticationDatabase admin --out /dump
docker cp $(docker-compose ps -q mongodb):/dump ./backup
```

This will create a backup in the `backup` directory.

## Troubleshooting

### SSL Certificate Issues

If you encounter issues with SSL certificates:

1. Check that your domain is correctly pointing to your server's IP address
2. Verify that ports 80 and 443 are open on your server
3. Check the Traefik logs: `docker-compose logs traefik`

### Application Not Starting

If the application fails to start:

1. Check the logs for each service: `docker-compose logs [service_name]`
2. Verify that all environment variables are correctly set
3. Ensure that the MongoDB service is running properly

## Security Considerations

- The MongoDB password and JWT secret are randomly generated for security
- All traffic is encrypted using SSL/TLS
- The application uses rate limiting to prevent abuse
- Docker containers are isolated from the host system

For additional security, consider:
- Setting up a firewall (UFW)
- Configuring regular security updates
- Implementing database backups
- Setting up monitoring and alerting
