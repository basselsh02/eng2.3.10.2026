import express from "express";
import {
    getTaskTimeline,
    getOfficeWorkload,
    getUserActivity,
    createOrUpdateOfficeLog,
    assignTaskToEmployee,
    completeTask,
    returnTask,
    getWorkflowActivityStats
} from "../controllers/workflowActivity.controller.js";

const router = express.Router();

// Get statistics
router.get("/stats", getWorkflowActivityStats);

// Get task timeline
router.get("/tasks/:taskId/timeline", getTaskTimeline);

// Get office workload
router.get("/offices/:officeId/workload", getOfficeWorkload);

// Get user activity
router.get("/users/:userId/activity", getUserActivity);

// Create or update office log
router.post("/office-logs", createOrUpdateOfficeLog);

// Assign task to employee
router.patch("/office-logs/:logId/assign", assignTaskToEmployee);

// Complete/forward task
router.patch("/office-logs/:logId/complete", completeTask);

// Return task
router.patch("/office-logs/:logId/return", returnTask);

export default router;
