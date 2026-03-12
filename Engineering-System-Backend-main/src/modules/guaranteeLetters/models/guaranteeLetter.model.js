import mongoose from "mongoose";

const guaranteeLetterSchema = new mongoose.Schema(
  {
    projectCode: { type: String, index: true },
    guaranteeRequestNumber: String,
    guaranteeLetterDate: Date,
    letterEndDate: Date,
    renewalDate: Date,
    guaranteeValue: Number,
    letterType: String,
    bankName: String,
    entity: String,
    notes: String,
    expired: { type: Boolean, default: false },
    itemNumber: String,
    description: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("GuaranteeLetter", guaranteeLetterSchema);
