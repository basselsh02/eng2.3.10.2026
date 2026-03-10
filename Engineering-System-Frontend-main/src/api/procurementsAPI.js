import api from "./axiosInstance";

export const getProcurements = async ({ page = 1, limit = 10, search = "" }) => {
    const { data } = await api.get("/procurements", { params: { page, limit, search } });
    return data;
};

export const getProcurementById = async (id) => {
    const { data } = await api.get(`/procurements/${id}`);
    return data;
};

export const createProcurement = async (formData) => {
    const { data } = await api.post("/procurements", formData);
    return data;
};

export const updateProcurement = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/procurements/${id}`, updates);
    return data;
};

export const deleteProcurement = async (id) => {
    const { data } = await api.delete(`/procurements/${id}`);
    return data;
};