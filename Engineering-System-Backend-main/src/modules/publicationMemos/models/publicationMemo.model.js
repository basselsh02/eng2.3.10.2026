import mongoose from "mongoose";

const publicationMemoSchema = new mongoose.Schema({
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
    // Military/Civil toggle - matches عسكري/مدني column in the UI
    staffType: {
        type: String,
        enum: ['عسكري/مدني', 'عسكري', 'مدني'],
        default: 'عسكري/مدني'
    },
    // Print action
    printAction: {
        type: String,
        default: "طباعة"
    }
}, { timestamps: true });

export default mongoose.model("PublicationMemo", publicationMemoSchema);