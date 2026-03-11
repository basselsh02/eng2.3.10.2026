import mongoose from "mongoose";

const fiscalYearSchema = new mongoose.Schema(
    {
        yearLabel: {
            type: String,
            required: [true, "Fiscal year label is required"],
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("FiscalYear", fiscalYearSchema);