import api from "./axiosInstance";

export const getProcedures = async ({ page = 1, limit = 10, search = "", projectId = "", procedureType = "" }) => {
    const { data } = await api.get("/procedures", { 
        params: { page, limit, search, projectId, procedureType } 
    });
    return data;
};

export const getProcedureById = async (id) => {
    const { data } = await api.get(`/procedures/${id}`);
    return data;
};

export const getProceduresByProject = async (projectId, procedureType = "") => {
    const { data } = await api.get(`/procedures/project/${projectId}`, {
        params: { procedureType }
    });
    return data;
};

export const createProcedure = async (formData) => {
    const { data } = await api.post("/procedures", formData);
    return data;
};

export const updateProcedure = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/procedures/${id}`, updates);
    return data;
};

export const deleteProcedure = async (id) => {
    const { data } = await api.delete(`/procedures/${id}`);
    return data;
};
