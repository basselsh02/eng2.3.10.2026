import api from "./axiosInstance";

export const getClaimsByProject = (projectId) => api.get("/claims", { params: { project_id: projectId } });
export const createClaim = (payload) => api.post("/claims", payload);
export const updateClaim = (id, payload) => api.patch(`/claims/${id}`, payload);
export const getGuaranteeLettersByProject = (projectId) => api.get("/guarantee-letters", { params: { project_id: projectId } });
export const createGuaranteeLetter = (payload) => api.post("/guarantee-letters", payload);
export const updateGuaranteeLetter = (id, payload) => api.patch(`/guarantee-letters/${id}`, payload);
export const renewGuaranteeLetter = (id, payload) => api.post(`/guarantee-letters/${id}/renew`, payload);
export const bulkRenewGuaranteeLetters = (payload) => api.post("/guarantee-letters/bulk-renew", payload);
export const toggleGuaranteeItem = (id, payload) => api.patch(`/guarantee-items/${id}`, payload);
