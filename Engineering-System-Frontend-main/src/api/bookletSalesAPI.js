import api from "./axiosInstance";

export const getBookletSales = async (filters) => {
    const res = await api.get("/booklet-sales", { params: filters });
    return res.data;
};

export const getBookletSaleById = async (id) => {
    const res = await api.get(`/booklet-sales/${id}`);
    return res.data;
};

export const createBookletSale = async (data) => {
    const res = await api.post("/booklet-sales", data);
    return res.data;
};

export const updateBookletSale = async ({ id, data }) => {
    const res = await api.patch(`/booklet-sales/${id}`, data);
    return res.data;
};

export const deleteBookletSale = async (id) => {
    const res = await api.delete(`/booklet-sales/${id}`);
    return res.data;
};
