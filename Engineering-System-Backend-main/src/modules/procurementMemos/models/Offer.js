import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
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
        offerTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OfferType",
            default: null,
        },

        // ── Screen 1: عروض الشركات ──────────────────────────────────────────
        sequenceNumber: { type: String, trim: true, default: "" },
        offerNumber: { type: Number, default: null },
        sequenceOrder: { type: Number, default: null },
        submissionDate: { type: Date, default: null },
        expiryDate: { type: Date, default: null },
        securityApprovalNumber: { type: String, trim: true, default: "" },
        bidBondDetails: { type: String, trim: true, default: "" },
        bidBondDate: { type: Date, default: null },
        documentCount: { type: Number, default: 0 },

        // ── Screen 3: اجراءات الفتح المالي ─────────────────────────────────
        financialDocsStatus: {
            type: String,
            enum: ["delivered", "pending", "missing"],
            default: "pending",
        },
        financialValue: { type: Number, default: 0 },

        // ── Screen 4: اجراءات البت المالي ──────────────────────────────────
        itemNumbers: { type: String, trim: true, default: "" },
        reviewedValue: { type: Number, default: 0 },
        discountPercentage: { type: Number, default: 0 },
        // valueAfterDiscount is computed in controller — NOT stored
        isExcluded: { type: Boolean, default: false },

        // ── Screen 2: Technical decision (per-offer) ────────────────────────
        committeeDecision: {
            type: String,
            enum: ["accepted", "rejected", "deferred", ""],
            default: "",
        },
        technicalDecisionDate: { type: Date, default: null },
        rulingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DecisionReason",
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);