import mongoose from "mongoose";

const offerItemSchema = new mongoose.Schema(
    {
        offerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offer",
            required: [true, "Offer reference is required"],
        },
        itemNumber: {
            type: Number,
            required: [true, "Item number is required"],
        },
        itemCode: { type: String, trim: true, default: "" },
        itemName: { type: String, trim: true, default: "" },
        itemNameAsSubmitted: { type: String, trim: true, default: "" },
        unitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            default: null,
        },
        quantity: { type: Number, default: 0 },
        referencePrice: { type: Number, default: 0 },
        unitPrice: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        // priceAfterDiscount & total: computed in controller — NOT stored

        // ── Screen 2: item-level technical decision ─────────────────────────
        decision: {
            type: String,
            enum: ["accepted", "rejected", "not_applicable", ""],
            default: "",
        },
        reasonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DecisionReason",
            default: null,
        },

        // ── Screen 4: item-level financial pricing ──────────────────────────
        companyPrice: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        // financialPriceAfterDiscount & financialTotal: computed in controller — NOT stored
    },
    { timestamps: true }
);

export default mongoose.model("OfferItem", offerItemSchema);