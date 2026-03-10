import api from "./axiosInstance";

export const getCollections = async (filters) => {
    const res = await api.get("/collections", { params: filters });
    return res.data;
};

export const getCollectionById = async (id) => {
    const res = await api.get(`/collections/${id}`);
    return res.data;
};

export const createCollection = async (data) => {
    const res = await api.post("/collections", data);
    return res.data;
};

export const updateCollection = async ({ id, data }) => {
    const res = await api.patch(`/collections/${id}`, data);
    return res.data;
};

export const deleteCollection = async (id) => {
    const res = await api.delete(`/collections/${id}`);
    return res.data;
};
