import api from "./axiosInstance";

export const getPublicationMemos = async (filters) => {
    const res = await api.get("/publication-memos", { params: filters });
    return res.data;
};

export const getPublicationMemoById = async (id) => {
    const res = await api.get(`/publication-memos/${id}`);
    return res.data;
};

export const createPublicationMemo = async (data) => {
    const res = await api.post("/publication-memos", data);
    return res.data;
};

export const updatePublicationMemo = async ({ id, data }) => {
    const res = await api.patch(`/publication-memos/${id}`, data);
    return res.data;
};

export const deletePublicationMemo = async (id) => {
    const res = await api.delete(`/publication-memos/${id}`);
    return res.data;
};
