import api from "./axiosInstance";

export const getFinancialProcedures = async ({ page = 1, limit = 10, search = "", projectId = "", procedureType = "" }) => {
    const { data } = await api.get("/financial-procedures", { 
        params: { page, limit, search, projectId, procedureType } 
    });
    return data;
};

export const getFinancialProcedureById = async (id) => {
    const { data } = await api.get(`/financial-procedures/${id}`);
    return data;
};

export const getFinancialProceduresByProject = async (projectId, procedureType = "") => {
    const { data } = await api.get(`/financial-procedures/project/${projectId}`, {
        params: { procedureType }
    });
    return data;
};

export const createFinancialProcedure = async (formData) => {
    const { data} = await api.post("/financial-procedures", formData);
    return data;
};

export const updateFinancialProcedure = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/financial-procedures/${id}`, updates);
    return data;
};

export const deleteFinancialProcedure = async (id) => {
    const { data } = await api.delete(`/financial-procedures/${id}`);
    return data;
};
