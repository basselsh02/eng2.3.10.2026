// routes/user.routes.js

import express from "express";
import { protect, authorize, unitFilter } from "../../../middleware/auth.middleware.js";
import {
    createUser,
    getUser,
    getUsers,
    exportUsersToExcel,
    updateUser,                    // تعديل البيانات العادية فقط
    updateUserPermissions,         // جديد: تعديل الصلاحيات فقط
    getPermissionAuditLogs,        // جديد: سجل تغييرات الصلاحيات
    hardDeleteUser,
    deleteUser,
    getFilterOptions
} from "../controllers/user.controller.js";

const router = express.Router();

// إنشاء مستخدم
router.post("/", authorize("users:create", true), createUser);

// تصدير إكسل
router.post("/export", authorize("users:export"), unitFilter("users:read"), exportUsersToExcel);

// جلب المستخدمين + فلترة
router.get("/", authorize("users:read"), unitFilter("users:read"), getUsers);
router.get("/filter/:field", protect, authorize("users:read"), getFilterOptions);
router.get("/:id", protect, authorize("users:read", true), getUser);

// تعديل بيانات المستخدم العادية (الاسم، التليفون، الوحدة...)
router.patch("/:id", protect, authorize("users:update", true), updateUser);

// جديد: راوت منفصل ومحمي جدًا لتعديل الصلاحيات فقط
router.patch(
    "/:id/permissions",
    protect,
    authorize("users:update:updatePermissions"),   // صلاحية نادرة جدًا (غالبًا السوبر أدمن فقط)
    updateUserPermissions
);

// Get permission audit logs
router.get(
    "/audit/permissions/:userId?",
    protect,
    authorize("users:read"),
    getPermissionAuditLogs
);

// الحذف
router.delete("/:id", protect, authorize("users:delete", true), deleteUser);
router.delete("/hard/:id", protect, authorize("users:delete", true), hardDeleteUser);

export default router;