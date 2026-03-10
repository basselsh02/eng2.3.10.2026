import api from "./axiosInstance";

export const login = async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};