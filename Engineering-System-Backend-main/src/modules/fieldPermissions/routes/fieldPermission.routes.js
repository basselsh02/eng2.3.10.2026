import express from "express";
import {
    getAllFieldPermissions,
    getGroupedFieldPermissions,
    getResources,
    getResourcePermissions,
    getFieldPermissions,
    updateFieldPermission,
    bulkUpdateFieldPermissions,
    bulkUpdateRolePermissions,
    getMyFieldPermissions,
    resetFieldPermissions,
    deleteFieldPermission,
} from "../controllers/fieldPermission.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (any authenticated user can access)
router.get("/my-permissions", getMyFieldPermissions);

// Admin-only routes (require specific permissions)
// Get all resources and fields (for UI building)
router.get("/resources", authorize("users:read"), getResources);

// Get field permissions
router.get("/", authorize("users:read"), getAllFieldPermissions);
router.get("/grouped", authorize("users:read"), getGroupedFieldPermissions);
router.get("/resource/:resourceName", authorize("users:read"), getResourcePermissions);
router.get("/field/:resourceName/:fieldName", authorize("users:read"), getFieldPermissions);

// Update field permissions
router.patch("/:id", authorize("users:update:updatePermissions"), updateFieldPermission);
router.patch("/bulk/update", authorize("users:update:updatePermissions"), bulkUpdateFieldPermissions);
router.patch("/bulk/role/:role", authorize("users:update:updatePermissions"), bulkUpdateRolePermissions);

// Reset permissions
router.post("/reset", authorize("users:update:updatePermissions"), resetFieldPermissions);

// Delete permission (for testing/cleanup)
router.delete("/:id", authorize("users:delete"), deleteFieldPermission);

export default router;
