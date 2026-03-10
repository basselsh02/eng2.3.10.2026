import api from "./axiosInstance";

export const getAuditLogs = async ({ userId, action, resource, resourceId, startDate, endDate, page = 1, limit = 50 }) => {
    const { data } = await api.get("/audit-logs", {
        params: { userId, action, resource, resourceId, startDate, endDate, page, limit }
    });
    return data;
};

export const getAuditLogById = async (id) => {
    const { data } = await api.get(`/audit-logs/${id}`);
    return data;
};

export const getUserActivitySummary = async (userId, { startDate, endDate }) => {
    const { data } = await api.get(`/audit-logs/users/${userId}/summary`, {
        params: { startDate, endDate }
    });
    return data;
};

export const getResourceAccessHistory = async (resource, resourceId, { page = 1, limit = 50 }) => {
    const url = resourceId 
        ? `/audit-logs/resources/${resource}/${resourceId}`
        : `/audit-logs/resources/${resource}`;
    const { data } = await api.get(url, {
        params: { page, limit }
    });
    return data;
};

export const getSessionActivity = async (sessionId, { page = 1, limit = 50 }) => {
    const { data } = await api.get(`/audit-logs/sessions/${sessionId}`, {
        params: { page, limit }
    });
    return data;
};

export const getAuditStats = async ({ startDate, endDate }) => {
    const { data } = await api.get("/audit-logs/stats", {
        params: { startDate, endDate }
    });
    return data;
};
