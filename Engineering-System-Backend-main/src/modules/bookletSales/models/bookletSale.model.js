import mongoose from "mongoose";

const bookletSaleSchema = new mongoose.Schema({
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
    // Action buttons
    printMemoAction: {
        type: String,
        default: "طباعة مذكرة النشر"
    },
    // Military/Civil toggle
    staffType: {
        type: String,
        enum: ['عسكري/مدني', 'عسكري', 'مدني'],
        default: 'عسكري/مدني'
    },
    // Actions: I (info), ت (edit), ن (view), خطاب (letter)
    actions: [{
        actionType: String,
        actionValue: String
    }]
}, { timestamps: true });

export default mongoose.model("BookletSale", bookletSaleSchema);
