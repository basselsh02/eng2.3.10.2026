import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Company code is required'],
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
