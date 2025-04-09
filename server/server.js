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
const contactRoutes = require('./routes/contact.routes');
const configRoutes = require('./routes/config.routes');

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
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if(!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://client:3000'
    ];
    
    console.log('CORS request from origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authenticate, userRoutes);
app.use('/api/v1/subscriptions', authenticate, subscriptionRoutes);
app.use('/api/v1/admin', authenticate, adminRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/config', configRoutes);

// Import models
const Activity = require('./models/activity.model');
const Invoice = require('./models/invoice.model');
const Config = require('./models/config.model');

// Add routes to access data
app.get('/api/v1/seed/activities', authenticate, async (req, res) => {
  try {
    // Find activities for the user or their tenant
    const activities = await Activity.find({
      $or: [
        { userId: req.user.id },
        { tenantId: req.user.tenantId }
      ]
    }).sort({ date: -1 });
    
    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: {
        activities
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching activities',
      error: err.message
    });
  }
});

app.get('/api/v1/seed/invoices', authenticate, async (req, res) => {
  try {
    // Find invoices for the user
    const invoices = await Invoice.find({ userId: req.user.id }).sort({ date: -1 });
    
    res.status(200).json({
      status: 'success',
      results: invoices.length,
      data: {
        invoices
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching invoices',
      error: err.message
    });
  }
});

// Admin routes to access all data
app.get('/api/v1/admin/seed/activities', authenticate, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have permission to access this resource'
    });
  }
  
  try {
    // Get all activities
    const activities = await Activity.find().sort({ date: -1 });
    
    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: {
        activities
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching activities',
      error: err.message
    });
  }
});

app.get('/api/v1/admin/seed/invoices', authenticate, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have permission to access this resource'
    });
  }
  
  try {
    // Get all invoices
    const invoices = await Invoice.find().sort({ date: -1 });
    
    res.status(200).json({
      status: 'success',
      results: invoices.length,
      data: {
        invoices
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching invoices',
      error: err.message
    });
  }
});

// Add route to get subscription plans
app.get('/api/v1/subscription-plans', async (req, res) => {
  try {
    // Get subscription plans from config
    const config = await Config.findOne({ type: 'subscription_plans' });
    
    if (!config) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plans not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        plans: config.plans
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching subscription plans',
      error: err.message
    });
  }
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
