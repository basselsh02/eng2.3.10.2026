import api from "./axiosInstance";

// ── existing functions (unchanged) ───────────────────────────
export const getProjectData = async (filters) => {
    const res = await api.get("/project-data", { params: filters });
    return res.data;
};

export const getProjectDataById = async (id) => {
    const res = await api.get(`/project-data/${id}`);
    return res.data;
};

export const createProjectData = async (data) => {
    const res = await api.post("/project-data", data);
    return res.data;
};

export const updateProjectData = async ({ id, data }) => {
    const res = await api.patch(`/project-data/${id}`, data);
    return res.data;
};

export const deleteProjectData = async (id) => {
    const res = await api.delete(`/project-data/${id}`);
    return res.data;
};

export const addWorkItem = async ({ id, data }) => {
    const res = await api.post(`/project-data/${id}/work-items`, data);
    return res.data;
};

export const addCandidateCompany = async ({ id, data }) => {
    const res = await api.post(`/project-data/${id}/candidate-companies`, data);
    return res.data;
};

export const addProjectCondition = async ({ id, data }) => {
    const res = await api.post(`/project-data/${id}/project-conditions`, data);
    return res.data;
};

// ── NEW: fetch one record by projectCode + optional financialYear ─
export const getProjectDataByCode = async ({ projectCode, financialYear }) => {
    const params = { projectCode };
    if (financialYear) params.financialYear = financialYear;
    const res = await api.get("/project-data/by-code", { params });
    return res.data;
};
