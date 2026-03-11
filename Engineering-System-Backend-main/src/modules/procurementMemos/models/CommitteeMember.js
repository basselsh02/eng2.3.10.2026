import mongoose from 'mongoose';

const committeeMemberSchema = new mongoose.Schema(
  {
    memoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memo',
      required: [true, 'Memo reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    rank: {
      type: String,
      trim: true,
      default: '',
      // e.g. مقدم أ.ح, نقيب, مقدم, ملازم
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommitteeRole',
      default: null,
    },
    // تعمل — whether the member is active/participating (Screen 1, 3)
    isActive: {
      type: Boolean,
      default: true,
    },
    // توقيع — whether the member has signed (Screen 2)
    hasSigned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CommitteeMember', committeeMemberSchema);
