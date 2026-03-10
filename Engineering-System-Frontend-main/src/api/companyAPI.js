import api from "./axiosInstance";

export const getCompanies = async ({ page = 1, limit = 10, search = "" }) => {
    const { data } = await api.get("/companies", { params: { page, limit, search } });
    return data;
};

export const createCompany = async (formData) => {
    const { data } = await api.post("/companies", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

export const updateCompany = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/companies/${id}`, updates);
    return data;
};

export const deleteCompany = async (id) => {
    const { data} = await api.delete(`/companies/${id}`);
    return data;
};

export const getCompanyPosition = async () => {
    const { data } = await api.get("/companies/position");
    return data;
};
