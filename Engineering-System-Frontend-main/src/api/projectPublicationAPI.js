import api from "./axiosInstance";

export const getProjectPublications = async (filters) => {
    const res = await api.get("/project-publications", { params: filters });
    return res.data;
};

export const getProjectPublicationById = async (id) => {
    const res = await api.get(`/project-publications/${id}`);
    return res.data;
};

export const createProjectPublication = async (data) => {
    const res = await api.post("/project-publications", data);
    return res.data;
};

export const updateProjectPublication = async ({ id, data }) => {
    const res = await api.patch(`/project-publications/${id}`, data);
    return res.data;
};

export const deleteProjectPublication = async (id) => {
    const res = await api.delete(`/project-publications/${id}`);
    return res.data;
};
