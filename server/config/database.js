const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
    console.log('Connecting to MongoDB...');
    
    try {
      const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`;
      // const mongoURI2 = `mongodb://admin:password123@mongodb:27017/saas-template?authSource=admin`

      console.log(`MongoDB URI: ${mongoURI.replace(/:[^:]*@/, ':****@')}`); // Log URI with password hidden
      
      const conn = await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });
      
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      console.error('MongoDB connection error. Please make sure MongoDB is running and accessible.');
      
      // Don't exit the process, just log the error
      // This allows the server to continue running even if DB connection fails
      // process.exit(1);
      
      // Return null to indicate connection failure
      return null;
    }
  };

module.exports = connectDB;
