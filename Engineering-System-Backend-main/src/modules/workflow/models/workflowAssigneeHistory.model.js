import mongoose from "mongoose";

const workflowAssigneeHistorySchema = new mongoose.Schema({
    workflowTemplateId: {
        type: String,
        required: [true, "معرف قالب سير العمل مطلوب"],
        trim: true
    },
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: [true, "معرف المكتب مطلوب"]
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "معرف الموظف مطلوب"]
    },
    lastAssignedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Composite index for efficient lookups
workflowAssigneeHistorySchema.index({ workflowTemplateId: 1, officeId: 1 }, { unique: true });
workflowAssigneeHistorySchema.index({ officeId: 1 });
workflowAssigneeHistorySchema.index({ employeeId: 1 });
workflowAssigneeHistorySchema.index({ lastAssignedAt: -1 });

export default mongoose.model("WorkflowAssigneeHistory", workflowAssigneeHistorySchema);
