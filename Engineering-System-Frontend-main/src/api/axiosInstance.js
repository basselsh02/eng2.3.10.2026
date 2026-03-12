import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:6000/api",
    withCredentials: false, // لو API بتستخدم cookies
    timeout: 10000, // 10 ثواني
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
