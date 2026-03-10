import FieldPermission from "../models/fieldPermission.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import { getAllResourcesAndFields } from "../../../config/seedFieldPermissions.js";

/**
 * Get all field permissions (with optional filtering)
 * @route GET /api/field-permissions
 */
export const getAllFieldPermissions = catchAsync(async (req, res) => {
    const { resource, role, permissionType, allowed } = req.query;

    // Build filter
    const filter = {};
    if (resource) filter.resource = resource;
    if (role) filter.role = role;
    if (permissionType) filter.permissionType = permissionType;
    if (allowed !== undefined) filter.allowed = allowed === "true";

    const permissions = await FieldPermission.find(filter)
        .sort({ resource: 1, fieldName: 1, permissionType: 1, role: 1 });

    res.status(200).json({
        success: true,
        count: permissions.length,
        data: permissions,
    });
});

/**
 * Get field permissions grouped by resource
 * @route GET /api/field-permissions/grouped
 */
export const getGroupedFieldPermissions = catchAsync(async (req, res) => {
    const { role } = req.query;

    const filter = role ? { role } : {};

    const permissions = await FieldPermission.find(filter)
        .sort({ resource: 1, fieldName: 1, permissionType: 1, role: 1 });

    // Group by resource
    const grouped = permissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = [];
        }
        acc[perm.resource].push(perm);
        return acc;
    }, {});

    res.status(200).json({
        success: true,
        data: grouped,
    });
});

/**
 * Get all resources and their fields
 * @route GET /api/field-permissions/resources
 */
export const getResources = catchAsync(async (req, res) => {
    const resources = await getAllResourcesAndFields();

    res.status(200).json({
        success: true,
        data: resources,
    });
});

/**
 * Get permissions for a specific resource
 * @route GET /api/field-permissions/resource/:resourceName
 */
export const getResourcePermissions = catchAsync(async (req, res) => {
    const { resourceName } = req.params;
    const { role } = req.query;

    const filter = { resource: resourceName };
    if (role) filter.role = role;

    const permissions = await FieldPermission.find(filter)
        .sort({ fieldName: 1, permissionType: 1, role: 1 });

    if (permissions.length === 0) {
        return res.status(404).json({
            success: false,
            message: `No permissions found for resource: ${resourceName}`,
        });
    }

    res.status(200).json({
        success: true,
        count: permissions.length,
        data: permissions,
    });
});

/**
 * Get permissions for a specific field
 * @route GET /api/field-permissions/field/:resourceName/:fieldName
 */
export const getFieldPermissions = catchAsync(async (req, res) => {
    const { resourceName, fieldName } = req.params;

    const permissions = await FieldPermission.find({
        resource: resourceName,
        fieldName: fieldName,
    }).sort({ permissionType: 1, role: 1 });

    if (permissions.length === 0) {
        return res.status(404).json({
            success: false,
            message: `No permissions found for field: ${resourceName}.${fieldName}`,
        });
    }

    res.status(200).json({
        success: true,
        count: permissions.length,
        data: permissions,
    });
});

/**
 * Update a single field permission
 * @route PATCH /api/field-permissions/:id
 */
export const updateFieldPermission = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { allowed } = req.body;

    if (typeof allowed !== "boolean") {
        return next(new AppError("'allowed' must be a boolean value", 400));
    }

    const permission = await FieldPermission.findByIdAndUpdate(
        id,
        { allowed },
        { new: true, runValidators: true }
    );

    if (!permission) {
        return res.status(404).json({
            success: false,
            message: "Field permission not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Field permission updated successfully",
        data: permission,
    });
});

/**
 * Bulk update field permissions
 * @route PATCH /api/field-permissions/bulk
 */
export const bulkUpdateFieldPermissions = catchAsync(async (req, res) => {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
        return next(
            new AppError("'updates' must be a non-empty array", 400)
        );
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
        try {
            const { id, allowed } = update;

            if (!id || typeof allowed !== "boolean") {
                errors.push({
                    id,
                    error: "Invalid update data",
                });
                continue;
            }

            const permission = await FieldPermission.findByIdAndUpdate(
                id,
                { allowed },
                { new: true, runValidators: true }
            );

            if (!permission) {
                errors.push({
                    id,
                    error: "Permission not found",
                });
            } else {
                results.push(permission);
            }
        } catch (error) {
            errors.push({
                id: update.id,
                error: error.message,
            });
        }
    }

    res.status(200).json({
        success: true,
        message: `Updated ${results.length} permissions`,
        data: {
            updated: results,
            errors: errors,
        },
    });
});

/**
 * Bulk update permissions for a role
 * @route PATCH /api/field-permissions/bulk/role/:role
 */
export const bulkUpdateRolePermissions = catchAsync(async (req, res) => {
    const { role } = req.params;
    const { resource, permissionType, allowed } = req.body;

    if (typeof allowed !== "boolean") {
        return next(new AppError("'allowed' must be a boolean value", 400));
    }

    const filter = { role };
    if (resource) filter.resource = resource;
    if (permissionType) filter.permissionType = permissionType;

    const result = await FieldPermission.updateMany(filter, { allowed });

    res.status(200).json({
        success: true,
        message: `Updated ${result.modifiedCount} permissions for role: ${role}`,
        data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        },
    });
});

/**
 * Get user's field permissions (for current logged-in user)
 * @route GET /api/field-permissions/my-permissions
 */
export const getMyFieldPermissions = catchAsync(async (req, res) => {
    const userRole = req.user.role;
    const { resource, permissionType } = req.query;

    // SUPER_ADMIN has all permissions
    if (userRole === "SUPER_ADMIN") {
        return res.status(200).json({
            success: true,
            message: "SUPER_ADMIN has access to all fields",
            data: {
                role: userRole,
                hasAllPermissions: true,
            },
        });
    }

    const filter = { role: userRole };
    if (resource) filter.resource = resource;
    if (permissionType) filter.permissionType = permissionType;

    const permissions = await FieldPermission.find(filter)
        .sort({ resource: 1, fieldName: 1, permissionType: 1 });

    // Group by resource
    const grouped = permissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = {
                READ: {},
                WRITE: {},
                UPDATE: {},
            };
        }
        acc[perm.resource][perm.permissionType][perm.fieldName] = perm.allowed;
        return acc;
    }, {});

    res.status(200).json({
        success: true,
        data: {
            role: userRole,
            permissions: grouped,
        },
    });
});

/**
 * Reset all permissions to default (allowed = true)
 * @route POST /api/field-permissions/reset
 */
export const resetFieldPermissions = catchAsync(async (req, res) => {
    const { resource, role } = req.body;

    const filter = {};
    if (resource) filter.resource = resource;
    if (role) filter.role = role;

    const result = await FieldPermission.updateMany(filter, { allowed: true });

    res.status(200).json({
        success: true,
        message: "Field permissions reset to default",
        data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        },
    });
});

/**
 * Delete field permissions (for cleanup/testing)
 * @route DELETE /api/field-permissions/:id
 */
export const deleteFieldPermission = catchAsync(async (req, res) => {
    const { id } = req.params;

    const permission = await FieldPermission.findByIdAndDelete(id);

    if (!permission) {
        return res.status(404).json({
            success: false,
            message: "Field permission not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Field permission deleted successfully",
    });
});
