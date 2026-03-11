import mongoose from 'mongoose';

const fiscalYearSchema = new mongoose.Schema(
  {
    yearLabel: {
      type: String,
      required: [true, 'Fiscal year label is required'],
      trim: true,
      unique: true,
      // e.g. "2026/2025"
    },
  },
  { timestamps: true }
);

export default mongoose.model('FiscalYear', fiscalYearSchema);
