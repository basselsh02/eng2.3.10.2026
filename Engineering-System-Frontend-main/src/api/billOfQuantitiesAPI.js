import api from "./axiosInstance";

export const getBillOfQuantities = async ({ page = 1, limit = 10, search = "" }) => {
    const { data } = await api.get("/bill-of-quantities", { params: { page, limit, search } });
    return data;
};

export const getBillOfQuantitieById = async (id) => {
    const { data } = await api.get(`/bill-of-quantities/${id}`);
    return data;
};

export const createBillOfQuantitie = async (formData) => {
    const { data } = await api.post("/bill-of-quantities", formData);
    return data;
};

export const updateBillOfQuantitie = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/bill-of-quantities/${id}`, updates);
    return data;
};

export const deleteBillOfQuantitie = async (id) => {
    const { data } = await api.delete(`/bill-of-quantities/${id}`);
    return data;
};