import FieldPermission from "../modules/fieldPermissions/models/fieldPermission.model.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

/**
 * Filter object fields based on field permissions
 * @param {Object} data - The data object to filter
 * @param {string[]} allowedFields - Array of allowed field names
 * @returns {Object} - Filtered object
 */
function filterFields(data, allowedFields) {
    if (!data || typeof data !== "object") {
        return data;
    }

    // If allowedFields is null, return all fields (SUPER_ADMIN case)
    if (allowedFields === null) {
        return data;
    }

    const filtered = {};
    
    for (const key of Object.keys(data)) {
        if (allowedFields.includes(key)) {
            filtered[key] = data[key];
        }
    }

    return filtered;
}

/**
 * Remove denied fields from object
 * @param {Object} data - The data object to clean
 * @param {string[]} deniedFields - Array of denied field names
 * @returns {Object} - Cleaned object
 */
function removeDeniedFields(data, deniedFields) {
    if (!data || typeof data !== "object" || !deniedFields || deniedFields.length === 0) {
        return data;
    }

    const cleaned = { ...data };
    
    for (const field of deniedFields) {
        delete cleaned[field];
    }

    return cleaned;
}

/**
 * Field Permission Middleware for READ operations
 * Filters response data to only include fields the user's role can read
 */
export const filterReadFields = (resourceName) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return next(new AppError("Authentication required", 401));
            }

            // SUPER_ADMIN has access to all fields
            if (userRole === "SUPER_ADMIN") {
                return next();
            }

            // Get denied fields for this role and resource
            const deniedFields = await FieldPermission.getDeniedFields(
                resourceName,
                "READ",
                userRole
            );

            // Store denied fields in request for use in response filtering
            req.deniedReadFields = deniedFields;
            req.resourceName = resourceName;

            // Intercept res.json to filter data before sending
            const originalJson = res.json.bind(res);
            
            res.json = function (data) {
                if (data && deniedFields.length > 0) {
                    // Handle different response structures
                    if (data.data) {
                        // Response has a 'data' wrapper
                        if (Array.isArray(data.data)) {
                            // Array of items
                            data.data = data.data.map(item => 
                                removeDeniedFields(item, deniedFields)
                            );
                        } else if (typeof data.data === "object") {
                            // Single item
                            data.data = removeDeniedFields(data.data, deniedFields);
                        }
                    } else if (Array.isArray(data)) {
                        // Direct array response
                        data = data.map(item => 
                            removeDeniedFields(item, deniedFields)
                        );
                    } else if (typeof data === "object") {
                        // Direct object response
                        data = removeDeniedFields(data, deniedFields);
                    }

                    // Handle paginated responses
                    if (data.docs && Array.isArray(data.docs)) {
                        data.docs = data.docs.map(item => 
                            removeDeniedFields(item, deniedFields)
                        );
                    }
                }

                return originalJson(data);
            };

            next();
        } catch (error) {
            logger.error("Error in filterReadFields middleware:", error);
            next(error);
        }
    };
};

/**
 * Field Permission Middleware for WRITE operations (POST)
 * Strips fields the user's role cannot write
 */
export const filterWriteFields = (resourceName) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return next(new AppError("Authentication required", 401));
            }

            // SUPER_ADMIN can write all fields
            if (userRole === "SUPER_ADMIN") {
                return next();
            }

            // Get denied fields for this role and resource
            const deniedFields = await FieldPermission.getDeniedFields(
                resourceName,
                "WRITE",
                userRole
            );

            if (deniedFields.length > 0 && req.body) {
                // Remove denied fields from request body
                req.body = removeDeniedFields(req.body, deniedFields);
                
                // Log which fields were stripped (for debugging)
                const strippedFields = deniedFields.filter(field => 
                    req.body.hasOwnProperty(field)
                );
                
                if (strippedFields.length > 0) {
                    logger.info(
                        `Stripped write-protected fields for ${userRole} on ${resourceName}:`,
                        strippedFields
                    );
                }
            }

            next();
        } catch (error) {
            logger.error("Error in filterWriteFields middleware:", error);
            next(error);
        }
    };
};

/**
 * Field Permission Middleware for UPDATE operations (PUT/PATCH)
 * Strips fields the user's role cannot update
 */
export const filterUpdateFields = (resourceName) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return next(new AppError("Authentication required", 401));
            }

            // SUPER_ADMIN can update all fields
            if (userRole === "SUPER_ADMIN") {
                return next();
            }

            // Get denied fields for this role and resource
            const deniedFields = await FieldPermission.getDeniedFields(
                resourceName,
                "UPDATE",
                userRole
            );

            if (deniedFields.length > 0 && req.body) {
                // Check if user is trying to update denied fields
                const attemptedDeniedFields = deniedFields.filter(field => 
                    req.body.hasOwnProperty(field)
                );

                // Remove denied fields from request body
                req.body = removeDeniedFields(req.body, deniedFields);
                
                if (attemptedDeniedFields.length > 0) {
                    logger.info(
                        `Stripped update-protected fields for ${userRole} on ${resourceName}:`,
                        attemptedDeniedFields
                    );
                }
            }

            next();
        } catch (error) {
            logger.error("Error in filterUpdateFields middleware:", error);
            next(error);
        }
    };
};

/**
 * Combined middleware that applies field filtering based on HTTP method
 */
export const applyFieldPermissions = (resourceName) => {
    return async (req, res, next) => {
        const method = req.method.toUpperCase();

        try {
            // Apply appropriate middleware based on HTTP method
            if (method === "GET") {
                return filterReadFields(resourceName)(req, res, next);
            } else if (method === "POST") {
                return filterWriteFields(resourceName)(req, res, next);
            } else if (method === "PUT" || method === "PATCH") {
                return filterUpdateFields(resourceName)(req, res, next);
            } else {
                // For other methods (DELETE, etc.), proceed without field filtering
                return next();
            }
        } catch (error) {
            logger.error("Error in applyFieldPermissions middleware:", error);
            next(error);
        }
    };
};

/**
 * Check if user can read specific fields
 * Utility function for custom use cases
 */
export async function canReadFields(role, resource, fields) {
    if (role === "SUPER_ADMIN") {
        return fields; // Can read all
    }

    const deniedFields = await FieldPermission.getDeniedFields(
        resource,
        "READ",
        role
    );

    return fields.filter(field => !deniedFields.includes(field));
}

/**
 * Check if user can write specific fields
 * Utility function for custom use cases
 */
export async function canWriteFields(role, resource, fields) {
    if (role === "SUPER_ADMIN") {
        return fields; // Can write all
    }

    const deniedFields = await FieldPermission.getDeniedFields(
        resource,
        "WRITE",
        role
    );

    return fields.filter(field => !deniedFields.includes(field));
}

/**
 * Check if user can update specific fields
 * Utility function for custom use cases
 */
export async function canUpdateFields(role, resource, fields) {
    if (role === "SUPER_ADMIN") {
        return fields; // Can update all
    }

    const deniedFields = await FieldPermission.getDeniedFields(
        resource,
        "UPDATE",
        role
    );

    return fields.filter(field => !deniedFields.includes(field));
}
