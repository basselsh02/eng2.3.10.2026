import api from "./axiosInstance";

export const getOffices = async ({ page = 1, limit = 10, search = "", type = "", isActive = "" }) => {
    const { data } = await api.get("/offices", {
        params: { page, limit, search, type, isActive }
    });
    return data;
};

export const getOfficeById = async (id) => {
    const { data } = await api.get(`/offices/${id}`);
    return data;
};

export const getOfficesDropdown = async (type = "") => {
    const { data } = await api.get("/offices/dropdown", {
        params: { type }
    });
    return data;
};

export const getOfficesStats = async () => {
    const { data } = await api.get("/offices/stats");
    return data;
};

export const createOffice = async (formData) => {
    const { data } = await api.post("/offices", formData);
    return data;
};

export const updateOffice = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/offices/${id}`, updates);
    return data;
};

export const deleteOffice = async (id) => {
    const { data } = await api.delete(`/offices/${id}`);
    return data;
};
