import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const contractBudgetStatementSchema = new mongoose.Schema({
    // Project Information
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
    
    // Tab 1: Project Data (بيانات المشروع)
    projectData: {
        projectNumber: String,          // رقم المشروع
        projectTypeCode: String,        // كود نوع المشروع
        financialYear: String,          // العام المالي
        projectName: String,            // اسم المشروع
        projectStartDate: Date,         // تاريخ بداية المشروع
        projectEndDate: Date,           // تاريخ نهاية المشروع
        agreementContract: String,      // الاتفاق/العقد
        fundingSource: String,          // جهة التمويل
        beneficiaryEntity: String,      // الجهة المستفيدة
        responsibleBranch: String,      // الفرع المسئول
        mainProject: String,            // المشروع الرئيسي
        companyCode: String             // كود الشركة
    },
    
    // Tab 2: Contractual Data (بيانات تعاقدية)
    contractualData: {
        projectNumber: String,          // رقم المشروع
        serialNumber: String,           // رقم المسلسل
        projectDescription: String,     // وصف المشروع
        budget: Number,                 // الموازنة
        financialYear: String,          // العام المالي
        item: String,                   // البند
        disbursement: Number,           // الصرف
        deductionItem: String,          // بند الخصم
        contractualValue: Number,       // القيمة التعاقدية
        companyCode: String,            // كود الشركة
        estimatedValue: Number          // القيمة التقديرية
    },
    
    // Tab 3: Disbursement Data (بيانات الصرف)
    disbursementData: {
        companyCode: String,            // كود الشركة
        companyName: String,            // اسم الشركة
        totalBudget: Number,
        totalDisbursed: Number,
        remainingBudget: Number,
        disbursementPercentage: Number,
        disbursementItems: [{
            itemNumber: String,
            itemDescription: String,
            budgetedAmount: Number,
            disbursedAmount: Number,
            remainingAmount: Number,
            disbursementDate: Date,
            invoiceNumber: String,
            notes: String
        }]
    },
    
    // Tab 4: Materials Disbursement (صرف خامات)
    materialsDisbursement: {
        totalMaterialsBudget: Number,
        totalMaterialsDisbursed: Number,
        remainingMaterialsBudget: Number,
        materials: [{
            code: String,               // الكود
            materialsDescription: String, // وصف الخامات
            quantity: Number,           // الكمية
            unit: String,               // الوحدة
            unitDescription: String,    // وصف الوحدة
            unitPrice: Number,          // سعر الوحدة
            total: Number               // الاجمالي
        }]
    },
    
    status: {
        type: String,
        enum: ["draft", "pending", "approved", "rejected", "completed"],
        default: "draft"
    },
    
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approvalDate: Date,
    
    notes: String,
    attachments: [String],
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
contractBudgetStatementSchema.plugin(mongoosePaginate);

// Indexes
contractBudgetStatementSchema.index({ projectCode: 1, financialYear: 1 });
contractBudgetStatementSchema.index({ organizationalUnit: 1 });
contractBudgetStatementSchema.index({ status: 1 });
contractBudgetStatementSchema.index({ createdAt: -1 });
contractBudgetStatementSchema.index({ 'contractualData.contractNumber': 1 });

export default mongoose.model("ContractBudgetStatement", contractBudgetStatementSchema);
