/**
 * MongoDB Setup Script
 * 
 * This script creates the admin user for MongoDB if it doesn't exist
 * and ensures the database is properly configured for authentication.
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

// Check if .env exists in config directory, if not use the one in root
if (!fs.existsSync(path.resolve(__dirname, '../config/.env'))) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

async function setupMongoDB() {
  console.log('Starting MongoDB setup...');
  
  // Connection URL to MongoDB without authentication
  const url = `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}`;
  const dbName = process.env.MONGO_DB_NAME || 'saas-template';
  
  try {
    console.log(`Connecting to MongoDB at ${url}`);
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB (without authentication)');
    
    // Access the admin database to create user
    const adminDb = client.db('admin');
    
    // Check if admin user exists
    const adminExists = await adminDb.command({
      usersInfo: { user: process.env.MONGO_USERNAME, db: 'admin' }
    }).then(res => res.users.length > 0).catch(() => false);
    
    if (!adminExists) {
      console.log(`Creating admin user: ${process.env.MONGO_USERNAME}`);
      
      // Create admin user
      await adminDb.command({
        createUser: process.env.MONGO_USERNAME,
        pwd: process.env.MONGO_PASSWORD,
        roles: [
          { role: 'userAdminAnyDatabase', db: 'admin' },
          { role: 'readWriteAnyDatabase', db: 'admin' }
        ]
      });
      
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    // Check if we can connect with authentication
    await client.close();
    
    // Try connecting with authentication
    const authUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}/${dbName}?authSource=admin`;
    console.log('Testing authenticated connection...');
    
    const authClient = new MongoClient(authUrl, { useUnifiedTopology: true });
    await authClient.connect();
    console.log('Successfully connected with authentication!');
    
    // Create application database if it doesn't exist
    const appDb = authClient.db(dbName);
    
    // Check if the database has any collections
    const collections = await appDb.listCollections().toArray();
    if (collections.length === 0) {
      console.log(`Creating initial collection in ${dbName} database`);
      await appDb.createCollection('setup');
      console.log('Initial collection created');
    }
    
    await authClient.close();
    console.log('MongoDB setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up MongoDB:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

// Run the setup
setupMongoDB();