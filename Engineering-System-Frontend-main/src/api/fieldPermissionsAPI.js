import axiosInstance from "./axiosInstance";

/**
 * Get all field permissions (with optional filters)
 */
export const getAllFieldPermissions = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.resource) params.append("resource", filters.resource);
  if (filters.role) params.append("role", filters.role);
  if (filters.permissionType) params.append("permissionType", filters.permissionType);
  if (filters.allowed !== undefined) params.append("allowed", filters.allowed);

  const response = await axiosInstance.get(`/field-permissions?${params.toString()}`);
  return response.data;
};

/**
 * Get field permissions grouped by resource
 */
export const getGroupedFieldPermissions = async (role = null) => {
  const params = role ? `?role=${role}` : "";
  const response = await axiosInstance.get(`/field-permissions/grouped${params}`);
  return response.data;
};

/**
 * Get all resources and their fields
 */
export const getResources = async () => {
  const response = await axiosInstance.get("/field-permissions/resources");
  return response.data;
};

/**
 * Get permissions for a specific resource
 */
export const getResourcePermissions = async (resourceName, role = null) => {
  const params = role ? `?role=${role}` : "";
  const response = await axiosInstance.get(`/field-permissions/resource/${resourceName}${params}`);
  return response.data;
};

/**
 * Get permissions for a specific field
 */
export const getFieldPermissions = async (resourceName, fieldName) => {
  const response = await axiosInstance.get(`/field-permissions/field/${resourceName}/${fieldName}`);
  return response.data;
};

/**
 * Update a single field permission
 */
export const updateFieldPermission = async (id, allowed) => {
  const response = await axiosInstance.patch(`/field-permissions/${id}`, { allowed });
  return response.data;
};

/**
 * Bulk update field permissions
 */
export const bulkUpdateFieldPermissions = async (updates) => {
  const response = await axiosInstance.patch("/field-permissions/bulk/update", { updates });
  return response.data;
};

/**
 * Bulk update permissions for a role
 */
export const bulkUpdateRolePermissions = async (role, filters = {}) => {
  const response = await axiosInstance.patch(`/field-permissions/bulk/role/${role}`, filters);
  return response.data;
};

/**
 * Get current user's field permissions
 */
export const getMyFieldPermissions = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.resource) params.append("resource", filters.resource);
  if (filters.permissionType) params.append("permissionType", filters.permissionType);

  const response = await axiosInstance.get(`/field-permissions/my-permissions?${params.toString()}`);
  return response.data;
};

/**
 * Reset field permissions to default
 */
export const resetFieldPermissions = async (filters = {}) => {
  const response = await axiosInstance.post("/field-permissions/reset", filters);
  return response.data;
};

/**
 * Delete a field permission
 */
export const deleteFieldPermission = async (id) => {
  const response = await axiosInstance.delete(`/field-permissions/${id}`);
  return response.data;
};
