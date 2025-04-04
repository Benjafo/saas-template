const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // Added cookie-parser

// Load environment variables
dotenv.config({ path: './config/.env' });

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const adminRoutes = require('./routes/admin.routes');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const { authenticate } = require('./middleware/auth.middleware');

// Create Express app
const app = express();

// Trust proxy - needed for express-rate-limit behind a proxy
app.set('trust proxy', 1);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Cookie parser
app.use(cookieParser()); // Added cookie-parser middleware

// Enable CORS with specific options for credentials
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', // Allow requests from client origin
  credentials: true // Allow cookies to be sent
}));

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Initialize global seed data if it doesn't exist
if (!global.seedData) {
  global.seedData = {
    activities: [],
    invoices: []
  };
}

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authenticate, userRoutes);
app.use('/api/v1/subscriptions', authenticate, subscriptionRoutes);
app.use('/api/v1/admin', authenticate, adminRoutes);

// Add routes to access seed data
app.get('/api/v1/seed/activities', authenticate, (req, res) => {
  const userActivities = global.seedData.activities.filter(
    activity => activity.userId.toString() === req.user.id.toString() || 
                (req.user.tenantId && activity.tenantId && 
                 activity.tenantId.toString() === req.user.tenantId.toString())
  );
  
  res.status(200).json({
    status: 'success',
    results: userActivities.length,
    data: {
      activities: userActivities
    }
  });
});

app.get('/api/v1/seed/invoices', authenticate, (req, res) => {
  const userInvoices = global.seedData.invoices.filter(
    invoice => invoice.userId.toString() === req.user.id.toString()
  );
  
  res.status(200).json({
    status: 'success',
    results: userInvoices.length,
    data: {
      invoices: userInvoices
    }
  });
});

// Admin routes to access all seed data
app.get('/api/v1/admin/seed/activities', authenticate, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have permission to access this resource'
    });
  }
  
  res.status(200).json({
    status: 'success',
    results: global.seedData.activities.length,
    data: {
      activities: global.seedData.activities
    }
  });
});

app.get('/api/v1/admin/seed/invoices', authenticate, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have permission to access this resource'
    });
  }
  
  res.status(200).json({
    status: 'success',
    results: global.seedData.invoices.length,
    data: {
      invoices: global.seedData.invoices
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

// 404 handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
