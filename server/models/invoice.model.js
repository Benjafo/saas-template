const mongoose = require('mongoose');

/**
 * Invoice Item Schema (embedded in Invoice)
 */
const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Invoice item must have a description']
    },
    amount: {
      type: Number,
      required: [true, 'Invoice item must have an amount']
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  {
    _id: false, // Don't create separate IDs for embedded items
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Invoice Schema
 */
const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Invoice must be associated with a user']
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant'
    },
    userName: {
      type: String
    },
    userEmail: {
      type: String
    },
    amount: {
      type: Number,
      required: [true, 'Invoice must have an amount']
    },
    currency: {
      type: String,
      default: 'usd',
      enum: ['usd', 'eur', 'gbp', 'cad', 'aud']
    },
    status: {
      type: String,
      required: [true, 'Invoice must have a status'],
      enum: ['draft', 'unpaid', 'paid', 'refunded', 'cancelled'],
      default: 'draft'
    },
    date: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    description: {
      type: String
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: [true, 'Invoice must have a subtotal']
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Invoice must have a total']
    },
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice must have an invoice number'],
      unique: true
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer', 'paypal', null],
      default: null
    },
    paymentId: {
      type: String
    },
    notes: {
      type: String
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
invoiceSchema.index({ userId: 1, date: -1 });
invoiceSchema.index({ tenantId: 1, date: -1 });
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice; 