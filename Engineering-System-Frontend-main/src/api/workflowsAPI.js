import api from "./axiosInstance";

export const getWorkflows = async ({ page = 1, limit = 10, search = "", processType = "", officeId = "", stageState = "", isActive = "" }) => {
    const { data } = await api.get("/workflows", {
        params: { page, limit, search, processType, officeId, stageState, isActive }
    });
    return data;
};

export const getWorkflowById = async (id) => {
    const { data } = await api.get(`/workflows/${id}`);
    return data;
};

export const getWorkflowByProcessId = async (processId) => {
    const { data } = await api.get(`/workflows/process/${processId}`);
    return data;
};

export const getWorkflowStats = async () => {
    const { data } = await api.get("/workflows/stats");
    return data;
};

export const createWorkflow = async (formData) => {
    const { data } = await api.post("/workflows", formData);
    return data;
};

export const updateWorkflow = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/workflows/${id}`, updates);
    return data;
};

export const deleteWorkflow = async (id) => {
    const { data } = await api.delete(`/workflows/${id}`);
    return data;
};

export const updateStageState = async ({ id, stageNumber, ...updates }) => {
    const { data } = await api.patch(`/workflows/${id}/stages/${stageNumber}`, updates);
    return data;
};

export const returnStage = async ({ id, stageNumber, ...updates }) => {
    const { data } = await api.patch(`/workflows/${id}/stages/${stageNumber}/return`, updates);
    return data;
};
