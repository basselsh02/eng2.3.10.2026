import mongoose from "mongoose";

const supplyOrderSchema = new mongoose.Schema(
    {
        memoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Memo",
            required: [true, "Memo reference is required"],
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProcurementCompany",
            required: [true, "Company reference is required"],
        },
        orderNumber: { type: String, trim: true, default: "" },
        orderDate: { type: Date, default: null },
        subject: { type: String, trim: true, default: "" },
        discountPercentage: { type: Number, default: 0 },
        // totalValue computed from items — NOT stored
        // valueAfterDiscount computed — NOT stored
        guaranteePercentage: { type: Number, default: 0 },
        // guaranteeValue computed — NOT stored
        categoryGroupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            default: null,
        },
        notes: { type: String, trim: true, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model("SupplyOrder", supplyOrderSchema);