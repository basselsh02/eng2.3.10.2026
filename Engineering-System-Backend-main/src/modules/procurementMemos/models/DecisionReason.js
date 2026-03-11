import mongoose from 'mongoose';

const decisionReasonSchema = new mongoose.Schema(
  {
    reasonText: {
      type: String,
      required: [true, 'Reason text is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('DecisionReason', decisionReasonSchema);
