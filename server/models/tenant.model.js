const mongoose = require('mongoose');
const validator = require('validator');

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tenant must have a name'],
      trim: true,
      maxlength: [100, 'A tenant name cannot be more than 100 characters']
    },
    slug: {
      type: String,
      required: [true, 'A tenant must have a slug'],
      unique: true,
      lowercase: true,
      trim: true
    },
    domain: {
      type: String,
      validate: [validator.isFQDN, 'Please provide a valid domain name'],
      unique: true,
      sparse: true // Allow null/undefined values (for tenants without custom domains)
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A tenant must have an owner']
    },
    active: {
      type: Boolean,
      default: true
    },
    // Subscription and billing information
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'starter', 'professional', 'enterprise'],
        default: 'free'
      },
      status: {
        type: String,
        enum: ['active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete'],
        default: 'active'
      },
      startDate: Date,
      endDate: Date,
      trialEndsAt: Date,
      seats: {
        type: Number,
        default: 1,
        min: [1, 'A tenant must have at least 1 seat']
      },
      features: {
        storage: {
          type: Number, // in MB
          default: 100
        },
        customDomain: {
          type: Boolean,
          default: false
        },
        apiAccess: {
          type: Boolean,
          default: false
        },
        whiteLabeling: {
          type: Boolean,
          default: false
        },
        prioritySupport: {
          type: Boolean,
          default: false
        }
      }
    },
    // Billing information
    billing: {
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      billingEmail: {
        type: String,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      billingAddress: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
      },
      paymentMethod: {
        type: String,
        default: 'card'
      }
    },
    // Branding and customization
    branding: {
      logo: String,
      favicon: String,
      primaryColor: {
        type: String,
        default: '#3B82F6' // Default blue color
      },
      secondaryColor: {
        type: String,
        default: '#1E40AF'
      },
      customCSS: String
    },
    // Settings and configuration
    settings: {
      timezone: {
        type: String,
        default: 'UTC'
      },
      dateFormat: {
        type: String,
        default: 'MM/DD/YYYY'
      },
      defaultLanguage: {
        type: String,
        default: 'en'
      },
      emailNotifications: {
        type: Boolean,
        default: true
      },
      security: {
        mfaRequired: {
          type: Boolean,
          default: false
        },
        passwordPolicy: {
          minLength: {
            type: Number,
            default: 8
          },
          requireUppercase: {
            type: Boolean,
            default: false
          },
          requireNumbers: {
            type: Boolean,
            default: false
          },
          requireSymbols: {
            type: Boolean,
            default: false
          },
          passwordExpiryDays: {
            type: Number,
            default: 0 // 0 means never expire
          }
        },
        sessionTimeout: {
          type: Number,
          default: 30 // minutes
        }
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for users belonging to this tenant
tenantSchema.virtual('users', {
  ref: 'User',
  foreignField: 'tenantId',
  localField: '_id'
});

// QUERY MIDDLEWARE
// Only find active tenants
tenantSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Create indexes
tenantSchema.index({ slug: 1 });
tenantSchema.index({ domain: 1 });
tenantSchema.index({ owner: 1 });

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
