const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplyOrderItemSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'SupplyOrder',
    required: true
  },
  
  // Item Details
  itemNumber: {
    type: Number,
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
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    default: 0
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

// Pre-save middleware to calculate total
supplyOrderItemSchema.pre('save', function(next) {
  if (this.unitPrice && this.quantity) {
    this.total = this.unitPrice * this.quantity;
  }
  next();
});

// Indexes
supplyOrderItemSchema.index({ orderId: 1, itemNumber: 1 });

module.exports = mongoose.model('SupplyOrderItem', supplyOrderItemSchema);
