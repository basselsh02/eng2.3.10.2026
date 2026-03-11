import api from "./axiosInstance";

export const getMaintenanceReports = async (filters) => {
  const res = await api.get("/maintenance-reports", { params: filters });
  return res.data;
};

export const getMaintenanceReportById = async (id) => {
  const res = await api.get(`/maintenance-reports/${id}`);
  return res.data;
};

export const createMaintenanceReport = async (data) => {
  const res = await api.post("/maintenance-reports", data);
  return res.data;
};

export const updateMaintenanceReport = async ({ id, data }) => {
  const res = await api.put(`/maintenance-reports/${id}`, data);
  return res.data;
};

export const deleteMaintenanceReport = async (id) => {
  const res = await api.delete(`/maintenance-reports/${id}`);
  return res.data;
};

export const getProjectsDropdown = async (filters) => {
  const res = await api.get("/projects", { params: filters });
  return res.data;
};
