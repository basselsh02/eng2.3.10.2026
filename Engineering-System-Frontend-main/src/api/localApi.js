import api from "./axiosInstance";

export const getProjects = (params = {}) =>
  api.get("/projects", { params: { limit: 100, ...params } }).then((r) => r.data);
export const getProjectById = (id) => api.get(`/projects/${id}`).then((r) => r.data);
export const getContracts = (params = {}) =>
  api.get("/contracts", { params: { limit: 100, ...params } }).then((r) => r.data);
export const getContractById = (id) => api.get(`/contracts/${id}`).then((r) => r.data);
export const getExtracts = (params = {}) =>
  api.get("/extract-advances", { params: { limit: 100, ...params } }).then((r) => r.data);
export const getExtractById = (id) => api.get(`/extract-advances/${id}`).then((r) => r.data);
export const getProcurements = (params = {}) =>
  api.get("/procurements", { params: { limit: 100, ...params } }).then((r) => r.data);
export const getProcurementById = (id) => api.get(`/procurements/${id}`).then((r) => r.data);
export const getCompanies = (params = {}) =>
  api.get("/companies", { params: { limit: 100, ...params } }).then((r) => r.data);
export const getCompanyById = (id) => api.get(`/companies/${id}`).then((r) => r.data);
