const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplyOrderSchema = new Schema({
  memoId: {
    type: Schema.Types.ObjectId,
    ref: 'Memo',
    required: true
  },
  
  // Order Details
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Company Reference
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Subject and Description
  subject: {
    type: String,
    required: true
  },
  
  // Financial Details
  totalValue: {
    type: Number,
    required: true,
    min: 0
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
  guaranteePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  guaranteeValue: {
    type: Number,
    default: 0
  },
  
  // Category and Classification
  categoryGroupId: {
    type: Schema.Types.ObjectId,
    ref: 'CategoryGroup'
  },
  
  // Notes
  notes: {
    type: String,
    default: ''
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'issued', 'in_execution', 'completed', 'cancelled'],
    default: 'draft'
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

// Virtual for supply order items
supplyOrderSchema.virtual('items', {
  ref: 'SupplyOrderItem',
  localField: '_id',
  foreignField: 'orderId'
});

// Pre-save middleware to calculate values
supplyOrderSchema.pre('save', function(next) {
  // Calculate value after discount
  if (this.totalValue && this.discountPercentage) {
    this.valueAfterDiscount = this.totalValue * (1 - this.discountPercentage / 100);
  } else {
    this.valueAfterDiscount = this.totalValue;
  }
  
  // Calculate guarantee value
  if (this.valueAfterDiscount && this.guaranteePercentage) {
    this.guaranteeValue = this.valueAfterDiscount * (this.guaranteePercentage / 100);
  }
  
  next();
});

// Indexes
supplyOrderSchema.index({ orderNumber: 1 });
supplyOrderSchema.index({ memoId: 1 });
supplyOrderSchema.index({ companyId: 1 });
supplyOrderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('SupplyOrder', supplyOrderSchema);
