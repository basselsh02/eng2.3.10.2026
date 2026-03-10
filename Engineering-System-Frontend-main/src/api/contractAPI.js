import api from "./axiosInstance";

export const getAllContracts = async ({ page = 1, limit = 10, search = "" }) => {
    const { data } = await api.get("/contracts", { params: { page, limit, search } });
    return data;
};

export const getContractById = async (id) => {
    const { data } = await api.get(`/contracts/${id}`);
    return data;
};

export const createContract = async (formData) => {
    const { data } = await api.post("/contracts", formData);
    return data;
};

export const updateContract = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/contracts/${id}`, updates);
    return data;
};

export const deleteContract = async (id) => {
    const { data } = await api.delete(`/contracts/${id}`);
    return data;
};