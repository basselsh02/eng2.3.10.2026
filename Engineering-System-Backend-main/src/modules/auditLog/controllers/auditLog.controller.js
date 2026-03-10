import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import auditLoggerService from "../../../services/auditLogger.service.js";
import AuditLog from "../models/auditLog.model.js";
import mongoose from "mongoose";

/**
 * Get audit logs with filtering
 */
export const getAuditLogs = catchAsync(async (req, res, next) => {
    const {
        userId,
        action,
        resource,
        resourceId,
        startDate,
        endDate,
        page = 1,
        limit = 50
    } = req.query;

    const result = await auditLoggerService.getAuditLogs({
        userId,
        action,
        resource,
        resourceId,
        startDate,
        endDate,
        page: parseInt(page),
        limit: parseInt(limit)
    });

    res.status(200).json({
        success: true,
        data: result
    });
});

/**
 * Get audit log by ID
 */
export const getAuditLogById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف السجل غير صحيح", 400));
    }

    const log = await AuditLog.findById(id)
        .populate("userId", "fullNameArabic fullNameEnglish email role");

    if (!log) {
        return next(new AppError("السجل غير موجود", 404));
    }

    res.status(200).json({
        success: true,
        data: log
    });
});

/**
 * Get user activity summary
 */
export const getUserActivitySummary = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new AppError("معرف المستخدم غير صحيح", 400));
    }

    const summary = await auditLoggerService.getUserActivitySummary(
        userId,
        startDate,
        endDate
    );

    res.status(200).json({
        success: true,
        data: summary
    });
});

/**
 * Get resource access history
 */
export const getResourceAccessHistory = catchAsync(async (req, res, next) => {
    const { resource, resourceId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const filter = { resource };
    if (resourceId) {
        filter.resourceId = resourceId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
        AuditLog.find(filter)
            .populate("userId", "fullNameArabic fullNameEnglish email role")
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        AuditLog.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        data: {
            logs,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        }
    });
});

/**
 * Get session activity
 */
export const getSessionActivity = catchAsync(async (req, res, next) => {
    const { sessionId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
        AuditLog.find({ sessionId })
            .populate("userId", "fullNameArabic fullNameEnglish email role")
            .sort({ timestamp: 1 })
            .skip(skip)
            .limit(parseInt(limit)),
        AuditLog.countDocuments({ sessionId })
    ]);

    res.status(200).json({
        success: true,
        data: {
            logs,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        }
    });
});

/**
 * Get audit statistics
 */
export const getAuditStats = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const [actionStats, resourceStats, userStats, totalCount] = await Promise.all([
        // Actions distribution
        AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$action",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]),
        // Resources accessed
        AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$resource",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]),
        // Most active users
        AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$userId",
                    userName: { $first: "$userName" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]),
        // Total count
        AuditLog.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalLogs: totalCount,
            actionStats,
            resourceStats,
            topUsers: userStats
        }
    });
});
