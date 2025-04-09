const mongoose = require('mongoose');

/**
 * Feature Schema (embedded in plan)
 */
const featureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Feature must have a name']
    },
    description: {
      type: String
    },
    enabled: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: null
    },
    limitType: {
      type: String,
      enum: ['count', 'storage', 'bandwidth', null],
      default: null
    }
  },
  {
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Plan Schema (for storing subscription plans)
 */
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan must have a name']
    },
    id: {
      type: String,
      required: [true, 'Plan must have an ID'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String
    },
    price: {
      monthly: {
        amount: {
          type: Number,
          required: [true, 'Plan must have a monthly price']
        },
        currency: {
          type: String,
          default: 'usd'
        },
        display: {
          type: String
        }
      },
      annually: {
        amount: {
          type: Number,
          required: [true, 'Plan must have an annual price']
        },
        currency: {
          type: String,
          default: 'usd'
        },
        display: {
          type: String
        }
      }
    },
    features: [featureSchema],
    featuresList: [String], // Simple list for display purposes
    active: {
      type: Boolean,
      default: true
    },
    mostPopular: {
      type: Boolean,
      default: false
    },
    limits: {
      users: {
        type: Number,
        default: null
      },
      storage: {
        type: Number, // in MB
        default: null
      },
      apiCalls: {
        type: Number,
        default: null
      }
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

planSchema.index({ id: 1 }, { unique: true });
planSchema.index({ active: 1 });

/**
 * Config Schema (for storing application configuration)
 */
const configSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Config must have a type'],
      enum: ['subscription_plans', 'email_templates', 'system_settings', 'feature_flags', 'marketing_content'],
      unique: true
    },
    plans: [planSchema],
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    active: {
      type: Boolean,
      default: true
    },
    version: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

configSchema.index({ type: 1 }, { unique: true });

const Config = mongoose.model('Config', configSchema);

module.exports = Config;
