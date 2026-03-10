import api from "./axiosInstance";
import { saveAs } from "file-saver";

export const getUsers = async (filters) => {
    const res = await api.get("/users", { params: filters });
    return res.data;
};
export const getUser = async ({ id, ...filters }) => {
    const res = await api.get(`/users/${id}`, {
        params: filters,
    });
    return res.data;
};
export const suggestionFilter = async (field, search) => {
    const res = await api.get(`/users/filter/${field}`, { params: search });
    return res.data;
};
export const createUser = async (data) => {
    const response = await api.post("/users", data);
    return response.data;
};

export const updateUser = async ({ id, data }) => {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
};

// export excel
export const exportUsers = async ({ search = "", filters = {} } = {}) => {
    const payload = {
        search,
        filters: JSON.stringify(filters), // نفس اللي في الـ backend
    };

    const response = await api.post("/users/export", payload, {
        responseType: "blob", // الأهم جدًا
    });

    const today = new Date().toISOString().slice(0, 10);
    const filename = `المستخدمين_${today}.xlsx`;

    saveAs(response.data, filename);
};
// updateUserPermissions
export const updateUserPermissions = async ({ id, data }) => {
    const res = await api.patch(`/users/${id}/permissions`, data);
    return res.data;
};

// Get permission audit logs
export const getPermissionAuditLogs = async (userId, params) => {
    const endpoint = userId ? `/users/audit/permissions/${userId}` : '/users/audit/permissions';
    const res = await api.get(endpoint, { params });
    return res.data;
};
