import mongoose from "mongoose";

const workflowTaskFieldActivitySchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: [true, "معرف المهمة مطلوب"],
        index: true
    },
    workflowTaskOfficeLogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkflowTaskOfficeLog",
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "معرف المستخدم مطلوب"],
        index: true
    },
    userRole: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ["READ", "CREATE", "UPDATE", "LOGIN_IDLE"],
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    resourceId: {
        type: String,
        default: null
    },
    fieldName: {
        type: String,
        default: null
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true });

// Indexes for efficient queries
workflowTaskFieldActivitySchema.index({ taskId: 1, timestamp: -1 });
workflowTaskFieldActivitySchema.index({ workflowTaskOfficeLogId: 1, timestamp: -1 });
workflowTaskFieldActivitySchema.index({ userId: 1, timestamp: -1 });
workflowTaskFieldActivitySchema.index({ action: 1, timestamp: -1 });

export default mongoose.model("WorkflowTaskFieldActivity", workflowTaskFieldActivitySchema);
