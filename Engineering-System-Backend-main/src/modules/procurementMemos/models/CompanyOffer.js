const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companyOfferSchema = new Schema({
  memoId: {
    type: Schema.Types.ObjectId,
    ref: 'Memo',
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Offer Details
  offerNumber: {
    type: String,
    required: true
  },
  offerType: {
    type: Schema.Types.ObjectId,
    ref: 'OfferType',
    required: true
  },
  sequenceOrder: {
    type: Number,
    required: true
  },
  
  // Dates
  submissionDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  
  // Bid Bond Details
  bidBondDetails: {
    type: String,
    default: ''
  },
  bidBondDate: {
    type: Date
  },
  
  // Document Information
  documentCount: {
    type: Number,
    default: 0
  },
  
  // Financial Values
  financialValue: {
    type: Number,
    default: 0
  },
  reviewedValue: {
    type: Number,
    default: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  valueAfterDiscount: {
    type: Number,
    default: 0
  },
  
  // Security and Status
  securityApprovalNumber: {
    type: String,
    default: ''
  },
  isExcluded: {
    type: Boolean,
    default: false
  },
  
  // Decision Fields
  technicalDecision: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', ''],
    default: 'pending'
  },
  technicalDecisionReason: {
    type: Schema.Types.ObjectId,
    ref: 'DecisionReason'
  },
  financialDecision: {
    type: String,
    enum: ['pending', 'winner', 'rejected', ''],
    default: 'pending'
  },
  financialDecisionReason: {
    type: Schema.Types.ObjectId,
    ref: 'DecisionReason'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for offer items
companyOfferSchema.virtual('items', {
  ref: 'OfferItem',
  localField: '_id',
  foreignField: 'offerId'
});

// Pre-save middleware to calculate value after discount
companyOfferSchema.pre('save', function(next) {
  if (this.reviewedValue && this.discountPercentage) {
    this.valueAfterDiscount = this.reviewedValue * (1 - this.discountPercentage / 100);
  }
  next();
});

// Indexes
companyOfferSchema.index({ memoId: 1, sequenceOrder: 1 });
companyOfferSchema.index({ companyId: 1 });
companyOfferSchema.index({ offerNumber: 1 });

module.exports = mongoose.model('CompanyOffer', companyOfferSchema);
