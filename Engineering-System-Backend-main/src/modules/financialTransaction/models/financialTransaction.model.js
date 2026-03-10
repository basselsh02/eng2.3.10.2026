import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const financialTransactionSchema = new mongoose.Schema({
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
    // Company Offers Data
    companyData: {
        companyCode: String,
        companyName: String,
        offerType: String,
        offerNumber: String,
        serialOrder: String,
        offerDate: Date,
        offerStartDate: Date
    },
    // Company Offers List
    companyOffersList: [{
        companyCode: String,
        companyName: String,
        offerType: String,
        offerNumber: String,
        serialOrder: String,
        offerDate: Date
    }],
    // Technical Procedures
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
    // Financial Opening
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
    // Current Financial Items
    financialItems: [{
        itemNumber: String,
        itemCode: String,
        itemName: String,
        unit: String,
        quantity: Number,
        unitPrice: Number,
        total: Number
    }],
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        default: "pending"
    },
    notes: String,
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

// Add pagination plugin
financialTransactionSchema.plugin(mongoosePaginate);

// Indexes
financialTransactionSchema.index({ projectCode: 1, financialYear: 1 });
financialTransactionSchema.index({ organizationalUnit: 1 });
financialTransactionSchema.index({ status: 1 });
financialTransactionSchema.index({ createdAt: -1 });

export default mongoose.model("FinancialTransaction", financialTransactionSchema);
