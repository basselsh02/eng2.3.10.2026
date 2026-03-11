const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Committee Types
const committeeTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Offer Types
const offerTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Decision Reasons
const decisionReasonSchema = new Schema({
  reasonText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'financial', 'both'],
    default: 'both'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Committee Roles
const committeeRoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Fiscal Years
const fiscalYearSchema = new Schema({
  yearLabel: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Units of Measurement
const unitSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Category Groups
const categoryGroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Export all models
module.exports = {
  CommitteeType: mongoose.model('CommitteeType', committeeTypeSchema),
  OfferType: mongoose.model('OfferType', offerTypeSchema),
  DecisionReason: mongoose.model('DecisionReason', decisionReasonSchema),
  CommitteeRole: mongoose.model('CommitteeRole', committeeRoleSchema),
  FiscalYear: mongoose.model('FiscalYear', fiscalYearSchema),
  Unit: mongoose.model('Unit', unitSchema),
  CategoryGroup: mongoose.model('CategoryGroup', categoryGroupSchema)
};
