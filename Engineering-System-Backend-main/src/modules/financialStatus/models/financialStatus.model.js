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
        branch: {
            type: String
        },
        office: {
            type: String
        },
        division: {
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
