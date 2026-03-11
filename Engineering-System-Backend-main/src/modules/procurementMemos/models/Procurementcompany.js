import mongoose from "mongoose";

// NOTE: Lightweight company reference model used only by procurementMemos.
// Does NOT replace src/modules/company (or wherever companies are stored).
const procurementCompanySchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Company code is required"],
            trim: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ProcurementCompany", procurementCompanySchema);