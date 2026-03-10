import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import WorkflowTaskOfficeLog from "../models/workflowTaskOfficeLog.model.js";
import WorkflowTaskFieldActivity from "../models/workflowTaskFieldActivity.model.js";
import mongoose from "mongoose";

/**
 * Get task timeline (all office visits for a task)
 */
export const getTaskTimeline = catchAsync(async (req, res, next) => {
    const { taskId } = req.params;

    const timeline = await WorkflowTaskOfficeLog.find({ taskId })
        .populate("officeId", "name code type")
        .populate("managerId", "fullNameArabic fullNameEnglish email")
        .populate("employeeId", "fullNameArabic fullNameEnglish email")
        .sort({ arrivedAt: 1 });

    // Get field activities for each office log
    const timelineWithActivities = await Promise.all(
        timeline.map(async (log) => {
            const activities = await WorkflowTaskFieldActivity.find({
                workflowTaskOfficeLogId: log._id
            })
                .populate("userId", "fullNameArabic fullNameEnglish email role")
                .sort({ timestamp: 1 });

            return {
                ...log.toObject(),
                fieldActivities: activities
            };
        })
    );

    res.status(200).json({
        success: true,
        data: timelineWithActivities
    });
});

/**
 * Get office workload (all tasks in an office with status and time info)
 */
export const getOfficeWorkload = catchAsync(async (req, res, next) => {
    const { officeId } = req.params;
    const { startDate, endDate, status, page = 1, limit = 20 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(officeId)) {
        return next(new AppError("معرف المكتب غير صحيح", 400));
    }

    const filter = { officeId };

    if (status) {
        filter.status = status;
    }

    if (startDate || endDate) {
        filter.arrivedAt = {};
        if (startDate) filter.arrivedAt.$gte = new Date(startDate);
        if (endDate) filter.arrivedAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
        WorkflowTaskOfficeLog.find(filter)
            .populate("officeId", "name code type")
            .populate("managerId", "fullNameArabic fullNameEnglish")
            .populate("employeeId", "fullNameArabic fullNameEnglish")
            .sort({ arrivedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        WorkflowTaskOfficeLog.countDocuments(filter)
    ]);

    // Calculate if tasks are overdue (example: 24 hours SLA)
    const SLA_THRESHOLD = parseInt(req.query.slaThreshold) || 24 * 60 * 60; // Default 24 hours in seconds
    const now = new Date();

    const logsWithOverdueStatus = logs.map(log => {
        let isOverdue = false;
        let timeInOfficeNow = 0;

        if (log.status === "at_manager" || log.status === "at_employee") {
            timeInOfficeNow = Math.floor((now - new Date(log.arrivedAt)) / 1000);
            isOverdue = timeInOfficeNow > SLA_THRESHOLD;
        }

        return {
            ...log.toObject(),
            isOverdue,
            currentTimeInOffice: timeInOfficeNow
        };
    });

    res.status(200).json({
        success: true,
        data: {
            logs: logsWithOverdueStatus,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        }
    });
});

/**
 * Get user activity (all actions by a user)
 */
export const getUserActivity = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { startDate, endDate, taskId, page = 1, limit = 50 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new AppError("معرف المستخدم غير صحيح", 400));
    }

    const filter = { userId };

    if (taskId) {
        filter.taskId = taskId;
    }

    if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [activities, total] = await Promise.all([
        WorkflowTaskFieldActivity.find(filter)
            .populate("userId", "fullNameArabic fullNameEnglish email role")
            .populate("workflowTaskOfficeLogId")
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        WorkflowTaskFieldActivity.countDocuments(filter)
    ]);

    // Group by date
    const groupedByDate = activities.reduce((acc, activity) => {
        const date = new Date(activity.timestamp).toLocaleDateString('ar-EG');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(activity);
        return acc;
    }, {});

    res.status(200).json({
        success: true,
        data: {
            activities,
            groupedByDate,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        }
    });
});

/**
 * Create or update office log (for task arrivals)
 */
export const createOrUpdateOfficeLog = catchAsync(async (req, res, next) => {
    const {
        taskId,
        workflowStepId,
        officeId,
        status,
        managerId,
        employeeId,
        notes
    } = req.body;

    // Validate required fields
    if (!taskId || !workflowStepId || !officeId) {
        return next(new AppError("المعلومات المطلوبة غير مكتملة", 400));
    }

    // Check if task already has an active log for this office
    const existingLog = await WorkflowTaskOfficeLog.findOne({
        taskId,
        officeId,
        status: { $in: ["at_manager", "at_employee"] }
    });

    if (existingLog) {
        // Update existing log
        if (status) existingLog.status = status;
        if (managerId) existingLog.managerId = managerId;
        if (employeeId) {
            existingLog.employeeId = employeeId;
            existingLog.assignedToEmployeeAt = new Date();
        }
        if (notes) existingLog.notes = notes;

        if (status === "forwarded") {
            existingLog.completedAt = new Date();
        } else if (status === "returned_to_previous") {
            existingLog.wasReturned = true;
            existingLog.returnedAt = new Date();
        }

        await existingLog.save();

        res.status(200).json({
            success: true,
            message: "تم تحديث سجل المكتب بنجاح",
            data: existingLog
        });
    } else {
        // Check if task has been to this office before
        const previousVisits = await WorkflowTaskOfficeLog.countDocuments({
            taskId,
            officeId
        });

        // Create new log
        const newLog = await WorkflowTaskOfficeLog.create({
            taskId,
            workflowStepId,
            officeId,
            status: status || "at_manager",
            managerId,
            employeeId,
            arrivedAt: new Date(),
            visitCount: previousVisits + 1,
            notes
        });

        res.status(201).json({
            success: true,
            message: "تم إنشاء سجل المكتب بنجاح",
            data: newLog
        });
    }
});

/**
 * Assign task to employee
 */
export const assignTaskToEmployee = catchAsync(async (req, res, next) => {
    const { logId } = req.params;
    const { employeeId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(logId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
        return next(new AppError("المعرفات غير صحيحة", 400));
    }

    const log = await WorkflowTaskOfficeLog.findById(logId);

    if (!log) {
        return next(new AppError("السجل غير موجود", 404));
    }

    log.employeeId = employeeId;
    log.assignedToEmployeeAt = new Date();
    log.status = "at_employee";

    await log.save();

    res.status(200).json({
        success: true,
        message: "تم تعيين المهمة للموظف بنجاح",
        data: log
    });
});

/**
 * Complete or forward task
 */
export const completeTask = catchAsync(async (req, res, next) => {
    const { logId } = req.params;
    const { notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(logId)) {
        return next(new AppError("معرف السجل غير صحيح", 400));
    }

    const log = await WorkflowTaskOfficeLog.findById(logId);

    if (!log) {
        return next(new AppError("السجل غير موجود", 404));
    }

    log.status = "forwarded";
    log.completedAt = new Date();
    if (notes) log.notes = notes;

    await log.save();

    res.status(200).json({
        success: true,
        message: "تم إكمال المهمة بنجاح",
        data: log
    });
});

/**
 * Return task to previous office
 */
export const returnTask = catchAsync(async (req, res, next) => {
    const { logId } = req.params;
    const { notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(logId)) {
        return next(new AppError("معرف السجل غير صحيح", 400));
    }

    const log = await WorkflowTaskOfficeLog.findById(logId);

    if (!log) {
        return next(new AppError("السجل غير موجود", 404));
    }

    log.status = "returned_to_previous";
    log.wasReturned = true;
    log.returnedAt = new Date();
    if (notes) log.notes = notes;

    await log.save();

    res.status(200).json({
        success: true,
        message: "تم إرجاع المهمة بنجاح",
        data: log
    });
});

/**
 * Get workflow activity statistics
 */
export const getWorkflowActivityStats = catchAsync(async (req, res, next) => {
    const { officeId, startDate, endDate } = req.query;

    const filter = {};
    if (officeId) {
        if (!mongoose.Types.ObjectId.isValid(officeId)) {
            return next(new AppError("معرف المكتب غير صحيح", 400));
        }
        filter.officeId = officeId;
    }

    if (startDate || endDate) {
        filter.arrivedAt = {};
        if (startDate) filter.arrivedAt.$gte = new Date(startDate);
        if (endDate) filter.arrivedAt.$lte = new Date(endDate);
    }

    const [statusStats, avgTimes, totalTasks, returnedTasks] = await Promise.all([
        // Status distribution
        WorkflowTaskOfficeLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]),
        // Average times
        WorkflowTaskOfficeLog.aggregate([
            { $match: { ...filter, totalTimeInOffice: { $gt: 0 } } },
            {
                $group: {
                    _id: null,
                    avgTotalTime: { $avg: "$totalTimeInOffice" },
                    avgManagerTime: { $avg: "$timeAtManager" },
                    avgEmployeeTime: { $avg: "$timeAtEmployee" }
                }
            }
        ]),
        // Total tasks
        WorkflowTaskOfficeLog.countDocuments(filter),
        // Returned tasks
        WorkflowTaskOfficeLog.countDocuments({ ...filter, wasReturned: true })
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalTasks,
            returnedTasks,
            statusDistribution: statusStats,
            averageTimes: avgTimes[0] || {
                avgTotalTime: 0,
                avgManagerTime: 0,
                avgEmployeeTime: 0
            }
        }
    });
});
