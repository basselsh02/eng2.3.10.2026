import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
    conditions: [{
        order: String,
        value: String,
        desc: String,
        serial: String,
        name: String,
        code: String
    }],
    workItems: [{
        total: String,
        value: String,
        quantity: String,
        unit: String,
        code: String,
        desc: String,
        serial: String
    }],
    candidateCompanies: [String],
    registeredCompanies: [{
        recordNameNumber: String,
        recordNumber: String,
        companyName: String,
        registrationNumber: String
    }],
    // Additional fields for enhanced functionality
    branchName: {
        type: String
    },
    branchCode: {
        type: String
    },
    projectNumber: {
        type: String
    },
    currentDate: {
        type: Date
    },
    // Committee Members
    committeeMembers: [{
        name: {
            type: String
        },
        position: {
            type: String
        },
        approved: {
            type: Boolean,
            default: false
        },
        paymentMethod: {
            type: String
        },
        approvalModel: {
            type: String
        }
    }]
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
