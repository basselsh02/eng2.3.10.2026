import mongoose from "mongoose";

const WORKFLOW_STAGES = [
    "company_offers",
    "technical_opening",
    "technical_decision",
    "financial_opening",
    "financial_decision",
    "supply_order",
    "form19_notes",
];

const memoSchema = new mongoose.Schema(
    {
        refNumber: {
            type: String,
            required: [true, "Reference number is required"],
            trim: true,
        },
        documentType: {
            type: String,
            trim: true,
            default: "TRDD_UF",
        },
        fiscalYear: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FiscalYear",
            default: null,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },
        committeeTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommitteeType",
            default: null,
        },
        committeeDate: {
            type: Date,
            default: null,
        },
        committeeStatement: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
        currentStage: {
            type: String,
            enum: WORKFLOW_STAGES,
            default: "company_offers",
        },
        financialWinnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null,
        },
        financialWinnerRegisteredAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Memo", memoSchema);