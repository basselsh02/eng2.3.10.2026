import mongoose from "mongoose";

const projectPublicationSchema = new mongoose.Schema({
    projectCode: {
        type: String,
        required: true,
        unique: true
    },
    financialYear: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    contractingMethod: {
        type: String
    },
    issueDate: {
        type: Date
    },
    siteExitDate: {
        type: Date
    },
    actualStartDate: {
        type: Date
    },
    actualEndDate: {
        type: Date
    },
    ownerEntity: {
        type: String
    },
    estimatedCost: {
        type: Number
    },
    costPercentage: {
        type: Number
    },
    treasuryCode: {
        type: String
    },
    responsibleBranch: {
        type: String
    },
    company: {
        type: String
    },
    responsibleEmployee: {
        type: String
    },
    openingDate: {
        type: Date
    },
    publicationDate: {
        type: Date
    },
    mainProject: {
        type: String
    },
    // Candidate Companies for Publication (from ترشيح الشركات tab)
    candidateCompanies: [{
        companyName: String,
        registrationNumber: String,
        recordNumber: String,
        approvalNumber: String,
        purchased: { type: Boolean, default: false },
        insurancePaymentMethod: {
            type: String,
            enum: ["بدون", "نقدي", "شيك", "تحويل بنكي"],
            default: "بدون"
        }
    }],
    // Publication Memos List (from طباعة المذكرات tab)
    publicationMemosList: [{
        memoName: String,
        memoButton: String
    }],
    // Project Conditions (from شروط المشروع tab)
    projectConditions: [{
        conditionCode: String,
        conditionType: String,
        conditionSerialNumber: String,
        conditionDescription: String,
        conditionValue: String
    }]
}, { timestamps: true });

export default mongoose.model("ProjectPublication", projectPublicationSchema);
