import mongoose from 'mongoose';

const supplyOrderSchema = new mongoose.Schema(
  {
    memoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memo',
      required: [true, 'Memo reference is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
    orderNumber: {
      type: String,
      trim: true,
      default: '',
      // رقم أمر التوريد — e.g. "13/15" (auto-generated)
    },
    orderDate: {
      type: Date,
      default: null,
      // تاريخ أمر التوريد
    },
    subject: {
      type: String,
      trim: true,
      default: '',
      // الموضوع
    },
    discountPercentage: {
      type: Number,
      default: 0,
      // نسبة الخصم %
    },
    // totalValue computed from items — NOT stored raw, recalculated on read
    // valueAfterDiscount computed — NOT stored
    guaranteePercentage: {
      type: Number,
      default: 0,
      // نسبة الضمان
    },
    // guaranteeValue computed from totalValue × guaranteePercentage — NOT stored
    categoryGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      // المجموعة الصنفية — reuses item-category model (adjust ref if separate model exists)
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      // ملاحظات
    },
  },
  { timestamps: true }
);

export default mongoose.model('SupplyOrder', supplyOrderSchema);
