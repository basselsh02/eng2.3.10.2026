import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    projectCode: { type: String, index: true },
    extractId: { type: String, index: true },
    claimNumber: String,
    archiveReceiptDate: Date,
    followupCompletionDate: Date,
    claimType: String,
    code: String,
    employeeName: String,
    branchName: String,
    claimDate: Date,
    claimValue: Number,
    disbursementDue: Number,
    exitDate: Date,
    notes: String,
    completionNotes: String,
    companyCode: String,
    companyName: String,
    estimatedValue: Number,
    projectDescription: String,
    financialAwardDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);
