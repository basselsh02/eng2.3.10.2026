import api from "./axiosInstance";

export const createWithdrawalPermission = async ({ id, formData }) => {
    const response = await api.post(`/projects/${id}/withdrawal-permissions`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
export const updateWithdrawalPermission = async ({ projectID, withdrawalID, formData }) => {
    const response = await api.patch(`/projects/${projectID}/withdrawal-permissions/${withdrawalID}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};