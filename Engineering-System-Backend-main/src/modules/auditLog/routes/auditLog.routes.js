import express from "express";
import {
    getAuditLogs,
    getAuditLogById,
    getUserActivitySummary,
    getResourceAccessHistory,
    getSessionActivity,
    getAuditStats
} from "../controllers/auditLog.controller.js";

const router = express.Router();

// Get audit logs with filtering
router.get("/", getAuditLogs);

// Get statistics
router.get("/stats", getAuditStats);

// Get user activity summary
router.get("/users/:userId/summary", getUserActivitySummary);

// Get resource access history
router.get("/resources/:resource/:resourceId?", getResourceAccessHistory);

// Get session activity
router.get("/sessions/:sessionId", getSessionActivity);

// Get audit log by ID
router.get("/:id", getAuditLogById);

export default router;
