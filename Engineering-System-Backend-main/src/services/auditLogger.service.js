import AuditLog from "../modules/auditLog/models/auditLog.model.js";
import WorkflowTaskFieldActivity from "../modules/workflow/models/workflowTaskFieldActivity.model.js";

/**
 * Audit Logger Service
 * Handles all audit logging operations throughout the system
 */
class AuditLoggerService {
    /**
     * Log a general audit event
     */
    async log({
        userId,
        userRole,
        userName,
        action,
        resource,
        resourceId = null,
        fieldChanges = [],
        fieldsRead = [],
        ipAddress = null,
        userAgent = null,
        sessionId = null,
        metadata = {}
    }) {
        try {
            await AuditLog.create({
                userId,
                userRole,
                userName,
                action,
                resource,
                resourceId,
                fieldChanges,
                fieldsRead,
                ipAddress,
                userAgent,
                sessionId,
                metadata,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error logging audit:", error);
            // Don't throw - audit logging should not break the application
        }
    }

    /**
     * Log a READ operation
     */
    async logRead(user, resource, resourceId, fieldsRead, req) {
        await this.log({
            userId: user?._id,
            userRole: user?.role,
            userName: user?.fullNameArabic || user?.fullNameEnglish,
            action: "READ",
            resource,
            resourceId: resourceId?.toString(),
            fieldsRead,
            ipAddress: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.get("user-agent"),
            sessionId: req?.sessionId
        });
    }

    /**
     * Log a CREATE operation
     */
    async logCreate(user, resource, resourceId, data, req) {
        // Convert data to field changes format
        const fieldChanges = Object.keys(data).map(key => ({
            fieldName: key,
            oldValue: null,
            newValue: data[key]
        }));

        await this.log({
            userId: user?._id,
            userRole: user?.role,
            userName: user?.fullNameArabic || user?.fullNameEnglish,
            action: "CREATE",
            resource,
            resourceId: resourceId?.toString(),
            fieldChanges,
            ipAddress: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.get("user-agent"),
            sessionId: req?.sessionId
        });
    }

    /**
     * Log an UPDATE operation
     */
    async logUpdate(user, resource, resourceId, oldData, newData, req) {
        // Calculate field changes
        const fieldChanges = [];
        const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

        allKeys.forEach(key => {
            // Skip internal fields
            if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return;

            const oldValue = oldData?.[key];
            const newValue = newData?.[key];

            // Only log if values are different
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                fieldChanges.push({
                    fieldName: key,
                    oldValue,
                    newValue
                });
            }
        });

        if (fieldChanges.length > 0) {
            await this.log({
                userId: user?._id,
                userRole: user?.role,
                userName: user?.fullNameArabic || user?.fullNameEnglish,
                action: "UPDATE",
                resource,
                resourceId: resourceId?.toString(),
                fieldChanges,
                ipAddress: req?.ip || req?.connection?.remoteAddress,
                userAgent: req?.get("user-agent"),
                sessionId: req?.sessionId
            });
        }
    }

    /**
     * Log a DELETE operation
     */
    async logDelete(user, resource, resourceId, snapshot, req) {
        await this.log({
            userId: user?._id,
            userRole: user?.role,
            userName: user?.fullNameArabic || user?.fullNameEnglish,
            action: "DELETE",
            resource,
            resourceId: resourceId?.toString(),
            metadata: { deletedData: snapshot },
            ipAddress: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.get("user-agent"),
            sessionId: req?.sessionId
        });
    }

    /**
     * Log a LOGIN event
     */
    async logLogin(user, req) {
        await this.log({
            userId: user?._id,
            userRole: user?.role,
            userName: user?.fullNameArabic || user?.fullNameEnglish,
            action: "LOGIN",
            resource: "AUTH",
            ipAddress: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.get("user-agent"),
            sessionId: req?.sessionId
        });
    }

    /**
     * Log a LOGOUT event
     */
    async logLogout(user, req) {
        await this.log({
            userId: user?._id,
            userRole: user?.role,
            userName: user?.fullNameArabic || user?.fullNameEnglish,
            action: "LOGOUT",
            resource: "AUTH",
            ipAddress: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.get("user-agent"),
            sessionId: req?.sessionId
        });
    }

    /**
     * Log an IDLE session event
     */
    async logIdle(user, sessionId, metadata = {}) {
        await this.log({
            userId: user?._id,
            userRole: user?.role,
            userName: user?.fullNameArabic || user?.fullNameEnglish,
            action: "IDLE",
            resource: "SESSION",
            sessionId,
            metadata
        });
    }

    /**
     * Log workflow task field activity
     */
    async logTaskFieldActivity({
        taskId,
        workflowTaskOfficeLogId = null,
        userId,
        userRole,
        action,
        resource,
        resourceId = null,
        fieldName = null,
        oldValue = null,
        newValue = null
    }) {
        try {
            await WorkflowTaskFieldActivity.create({
                taskId,
                workflowTaskOfficeLogId,
                userId,
                userRole,
                action,
                resource,
                resourceId,
                fieldName,
                oldValue,
                newValue,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error logging task field activity:", error);
        }
    }

    /**
     * Log LOGIN_IDLE event for workflow tasks
     */
    async logLoginIdle(userId, userRole, taskId = null) {
        try {
            await WorkflowTaskFieldActivity.create({
                taskId: taskId || "NO_TASK",
                userId,
                userRole,
                action: "LOGIN_IDLE",
                resource: "SESSION",
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error logging login idle:", error);
        }
    }

    /**
     * Get audit logs with filtering
     */
    async getAuditLogs({ 
        userId, 
        action, 
        resource, 
        resourceId,
        startDate,
        endDate,
        page = 1,
        limit = 50
    }) {
        const filter = {};
        
        if (userId) filter.userId = userId;
        if (action) filter.action = action;
        if (resource) filter.resource = resource;
        if (resourceId) filter.resourceId = resourceId;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            AuditLog.find(filter)
                .populate("userId", "fullNameArabic fullNameEnglish email role")
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            AuditLog.countDocuments(filter)
        ]);

        return {
            logs,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    /**
     * Get user activity summary
     */
    async getUserActivitySummary(userId, startDate, endDate) {
        const filter = { userId };
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const summary = await AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$action",
                    count: { $sum: 1 }
                }
            }
        ]);

        return summary;
    }
}

export default new AuditLoggerService();
