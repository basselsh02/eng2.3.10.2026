import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Project code is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
