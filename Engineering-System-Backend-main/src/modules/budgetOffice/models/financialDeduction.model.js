import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const financialDeductionSchema = new mongoose.Schema({
    // Project Reference
    projectCode: {
        type: String,
        required: true,
        index: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    
    // New Required Fields (المخصمات المالية)
    budgetCode: {
        type: String,
        required: true
    },
    financialYear: {
        type: String,
        required: true
    },
    itemCode: {
        type: String,
        required: true
    },
    disbursementCode: {
        type: String,
        required: true
    },
    beneficiaryEntity: {
        type: String,
        required: true
    },
    deductionItem: {
        type: String,
        required: true
    },
    allocatedValue: {
        type: Number,
        required: true,
        min: 0
    },
    
    // Period Information (kept for historical data)
    periodFrom: Date,
    periodTo: Date,
    
    // Related Documents (kept for historical data)
    invoiceNumber: String,
    invoiceDate: Date,
    paymentOrderNumber: String,
    
    // Minimal Approval Workflow (kept for backend functionality)
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviewDate: Date,
    reviewNotes: String,
    
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approvalDate: Date,
    approvalNotes: String,
    
    // Payment Information (kept for historical data)
    paidDate: Date,
    paymentMethod: String,
    paymentReference: String,
    
    // Additional Information
    notes: String,
    attachments: [String],
    
    // Audit Trail
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
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
financialDeductionSchema.plugin(mongoosePaginate);

// Indexes
financialDeductionSchema.index({ projectCode: 1, financialYear: 1 });
financialDeductionSchema.index({ organizationalUnit: 1 });
financialDeductionSchema.index({ budgetCode: 1 });
financialDeductionSchema.index({ itemCode: 1 });
financialDeductionSchema.index({ disbursementCode: 1 });
financialDeductionSchema.index({ beneficiaryEntity: 1 });
financialDeductionSchema.index({ createdAt: -1 });

export default mongoose.model("FinancialDeduction", financialDeductionSchema);
