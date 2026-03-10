import mongoose from "mongoose";

const procedureSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Project is required"]
    },
    procedureType: {
        type: String,
        enum: ["company_offers", "technical_resolution", "financial_proposal"],
        default: "company_offers"
    },
    
    // Company Offers Tab
    companyOffers: [{
        company: {
            type: String,
            trim: true
        },
        offerType: {
            type: String,
            trim: true
        },
        offerNumber: {
            type: String,
            trim: true
        },
        offerDate: {
            type: Date
        },
        offerEndDate: {
            type: Date
        },
        conditions: {
            type: String
        },
        offerPurpose: {
            type: String
        },
        date: {
            type: Date
        },
        modelNumber: {
            type: String
        }
    }],
    
    // Technical Resolution Tab
    committeeData: [{
        recordNameNumber: {
            type: String
        },
        recordNumber: {
            type: String
        },
        companyName: {
            type: String
        }
    }],
    
    technicalProcedures: [{
        order: {
            type: Number
        },
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
        printModel: {
            type: String
        }
    }],
    
    // Financial Proposal Tab
    financialProposal: {
        offerType: {
            type: String
        },
        company: {
            type: String
        },
        offerNumber: {
            type: String
        },
        offerDate: {
            type: Date
        },
        items: [{
            rowCode: {
                type: String
            },
            description: {
                type: String
            },
            unit: {
                type: String
            },
            quantity: {
                type: Number,
                default: 0
            },
            unitPrice: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 0
            }
        }]
    },
    
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
procedureSchema.index({ project: 1, procedureType: 1 });
procedureSchema.index({ createdBy: 1 });
procedureSchema.index({ createdAt: -1 });

export default mongoose.model("Procedure", procedureSchema);
