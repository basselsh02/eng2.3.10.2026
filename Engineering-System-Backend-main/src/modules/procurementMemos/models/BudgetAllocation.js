import mongoose from 'mongoose';

const budgetAllocationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Budget allocation code is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BudgetAllocation', budgetAllocationSchema);
