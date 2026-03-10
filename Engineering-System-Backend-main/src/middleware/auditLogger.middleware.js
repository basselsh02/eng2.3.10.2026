import auditLoggerService from "../services/auditLogger.service.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Middleware to attach session ID to requests
 */
export const attachSessionId = (req, res, next) => {
    // Try to get session ID from header or create new one
    const sessionId = req.get("x-session-id") || uuidv4();
    req.sessionId = sessionId;
    
    // Send session ID back to client
    res.setHeader("x-session-id", sessionId);
    
    next();
};

/**
 * Middleware to capture response data for audit logging
 */
export const auditLogger = (req, res, next) => {
    // Store original methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Override res.json to capture response data
    res.json = function (data) {
        res.locals.responseData = data;
        return originalJson.call(this, data);
    };

    // Override res.send to capture response data
    res.send = function (data) {
        if (!res.locals.responseData && data) {
            try {
                res.locals.responseData = typeof data === "string" ? JSON.parse(data) : data;
            } catch (e) {
                res.locals.responseData = data;
            }
        }
        return originalSend.call(this, data);
    };

    // Capture response when finished
    res.on("finish", async () => {
        // Only log successful operations (2xx status codes)
        if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
            try {
                await logRequest(req, res);
            } catch (error) {
                console.error("Audit logging error:", error);
            }
        }
    });

    next();
};

/**
 * Helper function to log the request based on method and response
 */
async function logRequest(req, res) {
    const method = req.method;
    const path = req.path;
    const user = req.user;
    const responseData = res.locals.responseData;

    // Determine resource name from path
    const resource = extractResourceFromPath(path);
    if (!resource) return; // Skip if we can't determine resource

    // Extract resource ID from response or params
    const resourceId = responseData?.data?._id || 
                      responseData?.data?.id || 
                      req.params?.id ||
                      null;

    switch (method) {
        case "GET":
            await handleReadOperation(req, user, resource, resourceId, responseData);
            break;
        case "POST":
            await handleCreateOperation(req, user, resource, resourceId, responseData);
            break;
        case "PUT":
        case "PATCH":
            await handleUpdateOperation(req, user, resource, resourceId, responseData);
            break;
        case "DELETE":
            await handleDeleteOperation(req, user, resource, resourceId, responseData);
            break;
    }
}

/**
 * Handle READ operation logging
 */
async function handleReadOperation(req, user, resource, resourceId, responseData) {
    let fieldsRead = [];

    if (responseData?.data) {
        const data = responseData.data;
        
        // If it's an array (list operation), get fields from first item
        if (Array.isArray(data) && data.length > 0) {
            fieldsRead = Object.keys(data[0]).filter(k => !["_id", "__v"].includes(k));
        } 
        // If it's a single object
        else if (typeof data === "object" && data !== null && !Array.isArray(data)) {
            fieldsRead = Object.keys(data).filter(k => !["_id", "__v"].includes(k));
        }
    }

    await auditLoggerService.logRead(user, resource, resourceId, fieldsRead, req);
}

/**
 * Handle CREATE operation logging
 */
async function handleCreateOperation(req, user, resource, resourceId, responseData) {
    const createdData = responseData?.data || req.body;
    
    await auditLoggerService.logCreate(
        user,
        resource,
        resourceId,
        createdData,
        req
    );
}

/**
 * Handle UPDATE operation logging
 */
async function handleUpdateOperation(req, user, resource, resourceId, responseData) {
    // We only have new data, not old data in middleware
    // For proper old/new comparison, controllers should use the service directly
    const newData = req.body;
    
    await auditLoggerService.logUpdate(
        user,
        resource,
        resourceId,
        {}, // Old data not available in middleware
        newData,
        req
    );
}

/**
 * Handle DELETE operation logging
 */
async function handleDeleteOperation(req, user, resource, resourceId, responseData) {
    const snapshot = responseData?.data || {};
    
    await auditLoggerService.logDelete(
        user,
        resource,
        resourceId,
        snapshot,
        req
    );
}

/**
 * Extract resource name from API path
 */
function extractResourceFromPath(path) {
    // Remove /api/ prefix and get the main resource
    const match = path.match(/^\/api\/([^\/]+)/);
    if (!match) return null;
    
    // Convert kebab-case to PascalCase for resource name
    const resourcePath = match[1];
    return resourcePath
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

/**
 * Session activity tracker
 * Track idle sessions (no API calls for more than 5 minutes)
 */
const sessionActivityMap = new Map();

export const trackSessionActivity = (req, res, next) => {
    if (req.user && req.sessionId) {
        const key = `${req.user._id}_${req.sessionId}`;
        sessionActivityMap.set(key, {
            userId: req.user._id,
            userRole: req.user.role,
            userName: req.user.fullNameArabic || req.user.fullNameEnglish,
            sessionId: req.sessionId,
            lastActivity: new Date()
        });
    }
    next();
};

/**
 * Check for idle sessions every minute
 */
setInterval(async () => {
    const now = new Date();
    const idleThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

    for (const [key, session] of sessionActivityMap.entries()) {
        const timeSinceActivity = now - session.lastActivity;
        
        if (timeSinceActivity >= idleThreshold) {
            // Log idle session
            await auditLoggerService.logIdle(
                {
                    _id: session.userId,
                    role: session.userRole,
                    fullNameArabic: session.userName
                },
                session.sessionId,
                {
                    idleTime: Math.floor(timeSinceActivity / 1000),
                    lastActivity: session.lastActivity
                }
            );
            
            // Remove from map
            sessionActivityMap.delete(key);
        }
    }
}, 60000); // Check every minute
