import mongoose from "mongoose";

const financialFlowSchema = new mongoose.Schema({
    projectCode: {
        type: String,
        required: true,
        index: true
    },
    financialYear: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    branchName: {
        type: String,
        required: true
    },
    branchCode: {
        type: String,
        required: true
    },
    projectCost: {
        type: Number,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    projectNumber: {
        type: String,
        required: true
    },
    // Company Offers Tab
    companyOffers: [{
        companyCode: String,
        companyName: String,
        offerType: String,
        offerNumber: String,
        serialOrder: String,
        offerDate: Date,
        offerStartDate: Date
    }],
    // Technical Procedures Tab
    technicalProcedures: {
        companyCode: String,
        companyName: String,
        offerType: String,
        previousPercentage: Number,
        initialOrder: String,
        financialValueBeforeReview: Number,
        bankInterest: Number,
        advancedGuaranteeValue: Number,
        additionValueBefore: Number,
        financialValueAfterPercentage: Number,
        additionValueAfter: Number,
        percentageAfter: Number,
        committeeMembers: [{
            rank: String,
            name: String,
            position: String,
            signature: Boolean,
            financialOfferRegistered: Boolean,
            printForm12: Boolean
        }],
        technicalResults: [{
            companyCode: String,
            companyName: String,
            offerType: String,
            committeeDecision: String,
            technicalOpeningDate: Date,
            itemNumber: String
        }]
    },
    // Financial Opening Tab
    financialOpening: {
        companyCode: String,
        companyName: String,
        offerType: String,
        previousPercentage: Number,
        initialOrder: String,
        financialValueBeforeReview: Number,
        bankInterest: Number,
        advancedGuaranteeValue: Number,
        additionValueBefore: Number,
        financialValueAfterPercentage: Number,
        additionValueAfter: Number,
        percentageAfter: Number,
        offerEndDate: Date,
        offerDate: Date,
        technicalOpeningDate: Date,
        summaryDate: Date
    },
    // Current Financial Tab
    currentFinancial: {
        items: [{
            itemNumber: String,
            itemCode: String,
            itemName: String,
            unit: String,
            quantity: Number,
            unitPrice: Number,
            total: Number
        }]
    },
    status: {
        type: String,
        enum: ["draft", "pending", "approved", "rejected"],
        default: "draft"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organizationalUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
financialFlowSchema.index({ projectCode: 1, financialYear: 1 });
financialFlowSchema.index({ organizationalUnit: 1 });
financialFlowSchema.index({ createdAt: -1 });

export default mongoose.model("FinancialFlow", financialFlowSchema);
