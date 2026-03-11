import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
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
    offerTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OfferType',
      default: null,
    },

    // --- Screen 1: عروض الشركات ---
    sequenceNumber: {
      type: String,
      trim: true,
      default: '',
      // e.g. "3/1", "3/2"
    },
    offerNumber: {
      type: Number,
      default: null,
      // رقم العرض — e.g. 50
    },
    sequenceOrder: {
      type: Number,
      default: null,
      // ترتيب المسلسل — e.g. 2552
    },
    submissionDate: {
      type: Date,
      default: null,
      // تاريخ العرض
    },
    expiryDate: {
      type: Date,
      default: null,
      // تاريخ نهاية العرض
    },
    securityApprovalNumber: {
      type: String,
      trim: true,
      default: '',
      // رقم الموافقة الامنية
    },
    bidBondDetails: {
      type: String,
      trim: true,
      default: '',
      // التأمين الابتدائي — text description
    },
    bidBondDate: {
      type: Date,
      default: null,
      // تاريخها
    },
    documentCount: {
      type: Number,
      default: 0,
      // عدد الاوراق
    },

    // --- Screen 3: اجراءات الفتح المالي ---
    financialDocsStatus: {
      type: String,
      enum: ['delivered', 'pending', 'missing'],
      default: 'pending',
      // الاوراق المالية — e.g. "المقل" = delivered
    },
    financialValue: {
      type: Number,
      default: 0,
      // قيمة العرض المالي
    },

    // --- Screen 4: اجراءات البت المالي ---
    itemNumbers: {
      type: String,
      trim: true,
      default: '',
      // أرقام البنود — e.g. "1&6"
    },
    reviewedValue: {
      type: Number,
      default: 0,
      // المراجعة المالية
    },
    discountPercentage: {
      type: Number,
      default: 0,
      // الخصم%
    },
    // valueAfterDiscount is computed — NOT stored
    isExcluded: {
      type: Boolean,
      default: false,
      // مستبعد
    },

    // --- Screen 2: Technical decision (per-offer) ---
    committeeDecision: {
      type: String,
      enum: ['accepted', 'rejected', 'deferred', ''],
      default: '',
      // قرار اللجنة: مقبول / مرفوض / مؤجل
    },
    technicalDecisionDate: {
      type: Date,
      default: null,
      // تاريخ البت الفني
    },
    rulingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DecisionReason',
      default: null,
      // الفرار — ruling dropdown
    },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
