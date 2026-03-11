import mongoose from "mongoose";

const financialStatusSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Project is required"]
    },
    projectNumber: {
        type: String,
        trim: true
    },
    projectType: {
        type: String,
        trim: true
    },
    financialYear: {
        type: String,
        trim: true
    },

    projectDescription: {
        type: String
    },
    cardArrivalDate: {
        type: Date
    },
    technicalBroadcastDate: {
        type: Date
    },
    financialBroadcastDate: {
        type: Date
    },
    commitmentValue: {
        type: Number,
        default: 0
    },
    disbursementValue: {
        type: Number,
        default: 0
    },
    beneficiaryEntity: {
        type: String
    },
    companyName: {
        type: String
    },
    portal: {
        type: String
    },
    actualOpeningDate: {
        type: Date
    },
    responsibleEmployeeNumber: {
        type: Number
    },
    actualOpeningDate2: {
        type: Date
    },
    letterCode: {
        type: String
    },
    discountItem: {
        type: String
    },
    latestStatus: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    estimatedAmount: {
        type: Number,
        default: 0
    },
    actualAmount: {
        type: Number,
        default: 0
    },
    responsibleParty: {
        type: String
    },
    responsibleEmployee: {
        type: String
    },
    branch: {
        type: String
    },
    status: {
        type: String,
        enum: ["planned", "in_progress", "completed", "on_hold"],
        default: "planned"
    },
    notes: {
        type: String
    },
    
    // Events tracking
    events: [{
        code: {
            type: String
        },
        description: {
            type: String
        },
        eventDate: {
            type: Date
        },
        responsibleOffice: {
            type: String
        },
        refCode: {
            type: String
        },
        userName: {
            type: String
        },
        notes: {
            type: String
        }
    }],
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organizationalUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    }
}, { timestamps: true });

// Indexes for better query performance
financialStatusSchema.index({ project: 1 });
financialStatusSchema.index({ status: 1 });
financialStatusSchema.index({ financialYear: 1 });
financialStatusSchema.index({ createdBy: 1 });
financialStatusSchema.index({ createdAt: -1 });

export default mongoose.model("FinancialStatus", financialStatusSchema);
