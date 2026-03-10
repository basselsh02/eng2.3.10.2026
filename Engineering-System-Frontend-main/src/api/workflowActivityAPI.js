import api from "./axiosInstance";

export const getTaskTimeline = async (taskId) => {
    const { data } = await api.get(`/workflow-activity/tasks/${taskId}/timeline`);
    return data;
};

export const getOfficeWorkload = async (officeId, { startDate, endDate, status, slaThreshold, page = 1, limit = 20 }) => {
    const { data } = await api.get(`/workflow-activity/offices/${officeId}/workload`, {
        params: { startDate, endDate, status, slaThreshold, page, limit }
    });
    return data;
};

export const getUserActivity = async (userId, { startDate, endDate, taskId, page = 1, limit = 50 }) => {
    const { data } = await api.get(`/workflow-activity/users/${userId}/activity`, {
        params: { startDate, endDate, taskId, page, limit }
    });
    return data;
};

export const createOrUpdateOfficeLog = async (logData) => {
    const { data } = await api.post("/workflow-activity/office-logs", logData);
    return data;
};

export const assignTaskToEmployee = async (logId, employeeId) => {
    const { data } = await api.patch(`/workflow-activity/office-logs/${logId}/assign`, { employeeId });
    return data;
};

export const completeTask = async (logId, notes) => {
    const { data } = await api.patch(`/workflow-activity/office-logs/${logId}/complete`, { notes });
    return data;
};

export const returnTask = async (logId, notes) => {
    const { data } = await api.patch(`/workflow-activity/office-logs/${logId}/return`, { notes });
    return data;
};

export const getWorkflowActivityStats = async ({ officeId, startDate, endDate }) => {
    const { data } = await api.get("/workflow-activity/stats", {
        params: { officeId, startDate, endDate }
    });
    return data;
};
