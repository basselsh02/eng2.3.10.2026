import api from "./axiosInstance";

export const getAllPaymentOrders = async ({ page = 1, limit = 10, search = "" }) => {
    const { data } = await api.get("/payment-orders", { params: { page, limit, search } });
    return data;
};

export const getPaymentOrderById = async (id) => {
    const { data } = await api.get(`/payment-orders/${id}`);
    return data;
};

export const createPaymentOrder = async (formData) => {
    const { data } = await api.post("/payment-orders", formData);
    return data;
};

export const updatePaymentOrder = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/payment-orders/${id}`, updates);
    return data;
};

export const deletePaymentOrder = async (id) => {
    const { data } = await api.delete(`/payment-orders/${id}`);
    return data;
};