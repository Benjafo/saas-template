const mongoose = require('mongoose');

/**
 * Activity Schema for user and tenant activities
 */
const activitySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, 'Activity must have a user name']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Activity must be associated with a user']
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant'
    },
    action: {
      type: String,
      required: [true, 'Activity must have an action']
    },
    target: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
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

// Add indexes for faster queries
activitySchema.index({ userId: 1, date: -1 });
activitySchema.index({ tenantId: 1, date: -1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity; 