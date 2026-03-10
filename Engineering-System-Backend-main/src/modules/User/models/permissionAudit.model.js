import mongoose from "mongoose";

const permissionAuditSchema = new mongoose.Schema(
    {
        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            enum: ["PERMISSIONS_UPDATED", "PERMISSIONS_ADDED", "PERMISSIONS_REMOVED"],
            required: true,
        },
        previousPermissions: [{
            action: String,
            scope: String,
            units: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrganizationalUnit" }]
        }],
        newPermissions: [{
            action: String,
            scope: String,
            units: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrganizationalUnit" }]
        }],
        changes: {
            added: [String],
            removed: [String],
            modified: [String]
        },
        ipAddress: String,
        userAgent: String,
        reason: String, // Optional: reason for the change
    },
    { timestamps: true }
);

// Indexes for better performance
permissionAuditSchema.index({ targetUser: 1, createdAt: -1 });
permissionAuditSchema.index({ performedBy: 1, createdAt: -1 });
permissionAuditSchema.index({ createdAt: -1 });

export default mongoose.model("PermissionAudit", permissionAuditSchema);
