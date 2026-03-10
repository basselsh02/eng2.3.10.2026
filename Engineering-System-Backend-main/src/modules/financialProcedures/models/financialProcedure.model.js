import mongoose from "mongoose";

const financialProcedureSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Project is required"]
    },
    procedureType: {
        type: String,
        enum: ["offers", "proposal", "resolution"],
        default: "offers"
    },
    
    // Financial Offers Tab
    financialOffers: {
        company: {
            type: String
        },
        offerType: {
            type: String
        },
        offerNumber: {
            type: String
        },
        offerStartDate: {
            type: Date
        },
        offerEndDate: {
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
            },
            serialNumber: {
                type: String
            }
        }]
    },
    
    // Financial Proposal Procedures Tab
    proposalData: {
        companyName: {
            type: String
        },
        contractor: {
            type: String
        },
        offerType: {
            type: String
        },
        priceOffer: {
            type: Number,
            default: 0
        },
        contractType: {
            type: String
        },
        guaranteePercentage: {
            type: Number,
            default: 0
        },
        advancePercentage: {
            type: Number,
            default: 0
        },
        percentageBeforeAdvance: {
            type: Number,
            default: 0
        },
        percentageAfterAdvance: {
            type: Number,
            default: 0
        },
        businessInsurancePercentage: {
            type: Number,
            default: 0
        },
        finalBusinessInsuranceValue: {
            type: Number,
            default: 0
        },
        percentageAfterInsurance: {
            type: Number,
            default: 0
        }
    },
    
    committeeApproval: [{
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
        registration: {
            type: String
        },
        signature: {
            type: String
        }
    }],
    
    // Financial Resolution Tab
    resolutionData: {
        responsibleParty: {
            type: String
        },
        contractType: {
            type: String
        },
        priceOffer: {
            type: Number,
            default: 0
        },
        guaranteePercentage: {
            type: Number,
            default: 0
        },
        advancePercentage: {
            type: Number,
            default: 0
        },
        percentageBeforeAdvance: {
            type: Number,
            default: 0
        },
        percentageAfterAdvance: {
            type: Number,
            default: 0
        },
        businessInsurancePercentage: {
            type: Number,
            default: 0
        },
        finalBusinessInsuranceValue: {
            type: Number,
            default: 0
        }
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

// Indexes
financialProcedureSchema.index({ project: 1, procedureType: 1 });
financialProcedureSchema.index({ createdBy: 1 });
financialProcedureSchema.index({ createdAt: -1 });

export default mongoose.model("FinancialProcedure", financialProcedureSchema);
