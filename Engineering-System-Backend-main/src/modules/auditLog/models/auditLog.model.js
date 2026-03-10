import mongoose from "mongoose";

const fieldChangeSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
}, { _id: false });

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    userRole: {
        type: String,
        default: null
    },
    userName: {
        type: String,
        default: null
    },
    action: {
        type: String,
        enum: ["READ", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "IDLE"],
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
    fieldChanges: {
        type: [fieldChangeSchema],
        default: []
    },
    fieldsRead: {
        type: [String],
        default: []
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    sessionId: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

// Indexes for better query performance
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ sessionId: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
