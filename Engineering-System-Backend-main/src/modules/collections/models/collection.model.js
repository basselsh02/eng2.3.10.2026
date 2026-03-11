import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    projectNumber: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    projectCost: {
        type: Number,
        required: true
    },
    branchCode: {
        type: String
    },
    executingBranchName: {
        type: String
    },
    collectorName: {
        type: String
    },
    // المطبوع – number of printed booklets
    printed: {
        type: Number,
        default: 0
    },
    // المباع – number of sold booklets
    sold: {
        type: Number,
        default: 0
    },
    // Payment/Status buttons
    paymentButtons: [{
        buttonLabel: String,
        buttonAction: String
    }]
}, { timestamps: true });

export default mongoose.model("Collection", collectionSchema);
