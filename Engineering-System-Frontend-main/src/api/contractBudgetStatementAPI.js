import axiosInstance from "./axiosInstance";

// Get all contract budget statements
export const getContractBudgetStatements = async (params = {}) => {
    const response = await axiosInstance.get("/contract-budget-statements", { params });
    return response.data;
};

// Get contract budget statement by ID
export const getContractBudgetStatementById = async (id) => {
    const response = await axiosInstance.get(`/contract-budget-statements/${id}`);
    return response.data;
};

// Get statements by project
export const getStatementsByProject = async (projectId, params = {}) => {
    const response = await axiosInstance.get(`/contract-budget-statements/project/${projectId}`, { params });
    return response.data;
};

// Create contract budget statement
export const createContractBudgetStatement = async (data) => {
    const response = await axiosInstance.post("/contract-budget-statements", data);
    return response.data;
};

// Update contract budget statement
export const updateContractBudgetStatement = async ({ id, data }) => {
    const response = await axiosInstance.patch(`/contract-budget-statements/${id}`, data);
    return response.data;
};

// Delete contract budget statement
export const deleteContractBudgetStatement = async (id) => {
    const response = await axiosInstance.delete(`/contract-budget-statements/${id}`);
    return response.data;
};

// Update specific tabs
export const updateProjectData = async ({ id, data }) => {
    const response = await axiosInstance.patch(`/contract-budget-statements/${id}/project-data`, data);
    return response.data;
};

export const updateContractualData = async ({ id, data }) => {
    const response = await axiosInstance.patch(`/contract-budget-statements/${id}/contractual-data`, data);
    return response.data;
};

export const updateDisbursementData = async ({ id, data }) => {
    const response = await axiosInstance.patch(`/contract-budget-statements/${id}/disbursement-data`, data);
    return response.data;
};

export const updateMaterialsDisbursement = async ({ id, data }) => {
    const response = await axiosInstance.patch(`/contract-budget-statements/${id}/materials-disbursement`, data);
    return response.data;
};

// Approve/Reject statement
export const approveStatement = async ({ id, approvalNotes }) => {
    const response = await axiosInstance.patch(`/contract-budget-statements/${id}/approve`, { approvalNotes });
    return response.data;
};

export const rejectStatement = async ({ id, rejectionNotes }) => {
    const response = await axiosInstance.patch(`/contract-budget-statements/${id}/reject`, { rejectionNotes });
    return response.data;
};
