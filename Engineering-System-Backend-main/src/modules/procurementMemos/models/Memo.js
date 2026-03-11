const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoSchema = new Schema({
  // Document Identity
  documentType: {
    type: String,
    default: 'TRDD_UF',
    required: true
  },
  refNumber: {
    type: String,
    required: true,
    unique: true
  },
  fiscalYear: {
    type: Schema.Types.ObjectId,
    ref: 'FiscalYear',
    required: true
  },
  
  // Project Reference
  projectCode: {
    type: String,
    required: true
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  
  // Committee Configuration
  committeeType: {
    type: Schema.Types.ObjectId,
    ref: 'CommitteeType',
    required: true
  },
  committeeDate: {
    type: Date,
    required: true
  },
  committeeStatement: {
    type: String,
    default: ''
  },
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'in_progress', 'completed', 'archived'],
    default: 'draft'
  },
  currentStage: {
    type: String,
    enum: ['company_offers', 'technical_opening', 'technical_decision', 'financial_opening', 'financial_decision', 'supply_order', 'form_19'],
    default: 'company_offers'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for committee members
memoSchema.virtual('committeeMembers', {
  ref: 'CommitteeMember',
  localField: '_id',
  foreignField: 'memoId'
});

// Virtual for company offers
memoSchema.virtual('companyOffers', {
  ref: 'CompanyOffer',
  localField: '_id',
  foreignField: 'memoId'
});

// Virtual for supply orders
memoSchema.virtual('supplyOrders', {
  ref: 'SupplyOrder',
  localField: '_id',
  foreignField: 'memoId'
});

// Indexes for performance
memoSchema.index({ refNumber: 1 });
memoSchema.index({ projectCode: 1 });
memoSchema.index({ createdAt: -1 });
memoSchema.index({ status: 1, currentStage: 1 });

module.exports = mongoose.model('Memo', memoSchema);
