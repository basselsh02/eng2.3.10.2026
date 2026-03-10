import mongoose from "mongoose";

const fieldPermissionSchema = new mongoose.Schema({
    resource: {
        type: String,
        required: true,
        trim: true,
        index: true,
        // e.g., "User", "Project", "Office", "Procedure"
    },
    fieldName: {
        type: String,
        required: true,
        trim: true,
        index: true,
        // e.g., "fullNameArabic", "projectCode", "estimatedCost"
    },
    permissionType: {
        type: String,
        enum: ["READ", "WRITE", "UPDATE"],
        required: true,
        index: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["SUPER_ADMIN", "مكتب", "مدير", "رئيس فرع", "مدير الادارة"],
        index: true,
    },
    allowed: {
        type: Boolean,
        default: true,
        index: true,
    },
    description: {
        type: String,
        trim: true,
    }
}, { 
    timestamps: true,
    // Ensure unique combination of resource + fieldName + permissionType + role
    indexes: [
        { resource: 1, fieldName: 1, permissionType: 1, role: 1 },
    ]
});

// Compound unique index to prevent duplicates
fieldPermissionSchema.index(
    { resource: 1, fieldName: 1, permissionType: 1, role: 1 },
    { unique: true }
);

// Static method to check if a role has permission for a field
fieldPermissionSchema.statics.hasFieldPermission = async function(
    resource,
    fieldName,
    permissionType,
    role
) {
    // SUPER_ADMIN always has access to all fields
    if (role === "SUPER_ADMIN") {
        return true;
    }

    const permission = await this.findOne({
        resource,
        fieldName,
        permissionType,
        role,
    });

    // If no permission record exists, default to allowed (backward compatibility)
    if (!permission) {
        return true;
    }

    return permission.allowed;
};

// Static method to get all allowed fields for a role on a resource
fieldPermissionSchema.statics.getAllowedFields = async function(
    resource,
    permissionType,
    role
) {
    // SUPER_ADMIN has access to all fields
    if (role === "SUPER_ADMIN") {
        return null; // null means all fields are allowed
    }

    const permissions = await this.find({
        resource,
        permissionType,
        role,
        allowed: true,
    }).select("fieldName");

    return permissions.map(p => p.fieldName);
};

// Static method to get denied fields for a role on a resource
fieldPermissionSchema.statics.getDeniedFields = async function(
    resource,
    permissionType,
    role
) {
    // SUPER_ADMIN has no denied fields
    if (role === "SUPER_ADMIN") {
        return [];
    }

    const permissions = await this.find({
        resource,
        permissionType,
        role,
        allowed: false,
    }).select("fieldName");

    return permissions.map(p => p.fieldName);
};

export default mongoose.model("FieldPermission", fieldPermissionSchema);
