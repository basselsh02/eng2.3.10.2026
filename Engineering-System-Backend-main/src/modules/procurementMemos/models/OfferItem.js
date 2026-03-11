import mongoose from 'mongoose';

const offerItemSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: [true, 'Offer reference is required'],
    },
    itemNumber: {
      type: Number,
      required: [true, 'Item number is required'],
      // رقم البند — 1, 2, 3...
    },
    itemCode: {
      type: String,
      trim: true,
      default: '',
      // كود الصنف / كود البند
    },
    itemName: {
      type: String,
      trim: true,
      default: '',
      // اسم الصنف
    },
    // اسم صنف الشركة في العرض (as submitted by the company — Screen 2 bottom)
    itemNameAsSubmitted: {
      type: String,
      trim: true,
      default: '',
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      default: null,
    },
    quantity: {
      type: Number,
      default: 0,
      // الكمية
    },
    referencePrice: {
      type: Number,
      default: 0,
      // السعر التقديري — system estimated price
    },
    unitPrice: {
      type: Number,
      default: 0,
      // سعر الوحدة — company's quoted price
    },
    discount: {
      type: Number,
      default: 0,
      // الخصم — discount amount per item
    },
    // priceAfterDiscount computed: unitPrice - discount — NOT stored
    // total computed: quantity × priceAfterDiscount — NOT stored

    // --- Screen 2: item-level technical decision ---
    decision: {
      type: String,
      enum: ['accepted', 'rejected', 'not_applicable', ''],
      default: '',
      // قرار اللجنة per item
    },
    reasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DecisionReason',
      default: null,
      // أسباب الفرار
    },

    // --- Screen 4: item-level financial pricing ---
    companyPrice: {
      type: Number,
      default: 0,
      // سعر الشركة
    },
    discountAmount: {
      type: Number,
      default: 0,
      // الخصم (financial tab)
    },
    // priceAfterDiscount and total are computed in controller
  },
  { timestamps: true }
);

export default mongoose.model('OfferItem', offerItemSchema);
