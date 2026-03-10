import api from "./axiosInstance";

export const getProjects = async (filters) => {
    const res = await api.get("/projects", { params: filters });
    return res.data;
};

export const getProjectById = async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
};

export const createProject = async (data) => {
    const res = await api.post("/projects", data);
    return res.data;
};

export const updateProject = async ({ id, data }) => {
    const res = await api.patch(`/projects/${id}`, data);
    return res.data;
};

export const deleteProject = async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
};
