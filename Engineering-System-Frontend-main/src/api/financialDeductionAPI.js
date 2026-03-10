import axiosInstance from "./axiosInstance";

// Get all financial deductions
export const getFinancialDeductions = async (params = {}) => {
    const response = await axiosInstance.get("/financial-deductions", { params });
    return response.data;
};

// Get financial deduction by ID
export const getFinancialDeductionById = async (id) => {
    const response = await axiosInstance.get(`/financial-deductions/${id}`);
    return response.data;
};

// Get deductions by project
export const getDeductionsByProject = async (projectId, params = {}) => {
    const response = await axiosInstance.get(`/financial-deductions/project/${projectId}`, { params });
    return response.data;
};

// Create financial deduction
export const createFinancialDeduction = async (data) => {
    const response = await axiosInstance.post("/financial-deductions", data);
    return response.data;
};

// Update financial deduction
export const updateFinancialDeduction = async ({ id, data }) => {
    const response = await axiosInstance.patch(`/financial-deductions/${id}`, data);
    return response.data;
};

// Delete financial deduction
export const deleteFinancialDeduction = async (id) => {
    const response = await axiosInstance.delete(`/financial-deductions/${id}`);
    return response.data;
};

// Review deduction
export const reviewDeduction = async ({ id, reviewNotes, approved }) => {
    const response = await axiosInstance.patch(`/financial-deductions/${id}/review`, { reviewNotes, approved });
    return response.data;
};

// Approve deduction
export const approveDeduction = async ({ id, approvalNotes }) => {
    const response = await axiosInstance.patch(`/financial-deductions/${id}/approve`, { approvalNotes });
    return response.data;
};

// Reject deduction
export const rejectDeduction = async ({ id, rejectionNotes }) => {
    const response = await axiosInstance.patch(`/financial-deductions/${id}/reject`, { rejectionNotes });
    return response.data;
};

// Mark as paid
export const markDeductionAsPaid = async ({ id, paymentMethod, paymentReference }) => {
    const response = await axiosInstance.patch(`/financial-deductions/${id}/mark-paid`, { paymentMethod, paymentReference });
    return response.data;
};

// Get statistics
export const getDeductionStatistics = async (params = {}) => {
    const response = await axiosInstance.get("/financial-deductions/stats/summary", { params });
    return response.data;
};
