import api from "./axiosInstance";

export const getUnitsTree = async (filters) => {
    const res = await api.get("/units/tree", { params: filters });
    return res.data;
};
export const createOrganizationUnit = async (data) => {
    const res = await api.post("/units", data);
    return res.data;
};
export const updateOrganizationUnit = async (id, data) => {
    const res = await api.put(`/units/${id}`, data);
    return res.data;
};
export const deleteOrganizationUnit = async (id, data) => {
    const res = await api.delete(`/units/${id}`, data);
    return res.data;
};

export const moveOrganizationUnit = async (id, { newParent }) => {
    const response = await api.patch(`/units/${id}/move`, { newParent });
    return response;
};