const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerItemSchema = new Schema({
  offerId: {
    type: Schema.Types.ObjectId,
    ref: 'CompanyOffer',
    required: true
  },
  
  // Item Identification
  itemNumber: {
    type: Number,
    required: true
  },
  itemCode: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  
  // Unit and Quantity
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Pricing
  referencePrice: {
    type: Number,
    default: 0
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  priceAfterDiscount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  
  // Decision
  decision: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', ''],
    default: 'pending'
  },
  decisionReason: {
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
  timestamps: true
});

// Pre-save middleware to calculate price after discount and total
offerItemSchema.pre('save', function(next) {
  // Calculate price after discount
  if (this.unitPrice && this.discount) {
    this.priceAfterDiscount = this.unitPrice - this.discount;
  } else {
    this.priceAfterDiscount = this.unitPrice;
  }
  
  // Calculate total
  if (this.priceAfterDiscount && this.quantity) {
    this.total = this.priceAfterDiscount * this.quantity;
  }
  
  next();
});

// Indexes
offerItemSchema.index({ offerId: 1, itemNumber: 1 });
offerItemSchema.index({ itemCode: 1 });

module.exports = mongoose.model('OfferItem', offerItemSchema);
