import api from "./axiosInstance";

export const getFinancialStatuses = async ({ page = 1, limit = 10, search = "", projectId = "", status = "", financialYear = "" }) => {
    const { data } = await api.get("/financial-status", {
        params: { page, limit, search, projectId, status, financialYear }
    });
    return data;
};

export const getFinancialStatusById = async (id) => {
    const { data } = await api.get(`/financial-status/${id}`);
    return data;
};

export const getFinancialStatusesByProject = async (projectId) => {
    const { data } = await api.get(`/financial-status/project/${projectId}`);
    return data;
};

export const getFinancialStatusByProjectCode = async (projectCode) => {
    const { data } = await api.get(`/projects/${projectCode}/financial-status`);
    return data;
};

export const createFinancialStatus = async (formData) => {
    const { data } = await api.post("/financial-status", formData);
    return data;
};

export const upsertFinancialStatusByProjectCode = async ({ projectCode, ...payload }) => {
    const { data } = await api.post(`/projects/${projectCode}/financial-status`, payload);
    return data;
};

export const getFinancialStatusHistoryByProjectCode = async (projectCode) => {
    const { data } = await api.get(`/projects/${projectCode}/financial-status/history`);
    return data;
};

export const updateFinancialStatus = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/financial-status/${id}`, updates);
    return data;
};

export const deleteFinancialStatus = async (id) => {
    const { data } = await api.delete(`/financial-status/${id}`);
    return data;
};

export const addEventToFinancialStatus = async ({ id, event }) => {
    const { data } = await api.post(`/financial-status/${id}/events`, event);
    return data;
};
