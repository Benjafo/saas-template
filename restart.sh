#!/bin/bash

echo "Stopping MongoDB if it's running..."
pkill mongod 2>/dev/null || true

echo "Creating data directory if it doesn't exist..."
mkdir -p ./data

echo "Starting MongoDB..."
mongod --dbpath ./data &

# Wait for MongoDB to start
echo "Waiting for MongoDB to start..."
sleep 5

echo "Setting up MongoDB (authentication and users)..."
cd server
npm run setup-db

echo "Seeding the database..."
npm run seed

echo "Starting the server..."
npm run dev