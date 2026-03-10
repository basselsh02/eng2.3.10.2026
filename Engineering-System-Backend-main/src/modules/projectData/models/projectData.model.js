import mongoose from "mongoose";

const projectDataSchema = new mongoose.Schema({
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
    // Work Items (بنود الاعمال)
    workItems: [{
        serial: String,
        desc: String,
        code: String,
        unit: String,
        quantity: String,
        value: String,
        total: String
    }],
    // Candidate Companies (ترشيح الشركات)
    candidateCompanies: [{
        registrationNumber: String,
        companies: String,
        recordNumber: String,
        recordNameNumber: String
    }],
    // Project Conditions (شروط المشروع)
    projectConditions: [{
        conditionTypeCode: String,
        conditionTypeName: String,
        serialCode: String,
        conditionDesc: String,
        value: String,
        order: String
    }],
    // Buttons states
    registerNewRound: {
        type: Boolean,
        default: false
    },
    downloadTerms: {
        type: String,
        default: ""
    },
    downloadConditional: {
        type: String,
        default: ""
    },
    approvalCommittee: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("ProjectData", projectDataSchema);
