import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMaintenanceReport,
  deleteMaintenanceReport,
  getMaintenanceReportById,
  getMaintenanceReports,
  getProjectsDropdown,
  updateMaintenanceReport,
} from "../api/maintenanceReportsAPI";

export const useMaintenanceReports = ({ page = 1, limit = 10, search = "", projectNumber = "" }) =>
  useQuery({
    queryKey: ["maintenanceReports", page, limit, search, projectNumber],
    queryFn: () => getMaintenanceReports({ page, limit, search, projectNumber }),
    keepPreviousData: true,
  });

export const useMaintenanceReport = (id) =>
  useQuery({
    queryKey: ["maintenanceReport", id],
    queryFn: () => getMaintenanceReportById(id),
    enabled: Boolean(id),
  });

export const useCreateMaintenanceReport = () =>
  useMutation({
    mutationFn: createMaintenanceReport,
  });

export const useUpdateMaintenanceReport = () =>
  useMutation({
    mutationFn: updateMaintenanceReport,
  });

export const useDeleteMaintenanceReport = () =>
  useMutation({
    mutationFn: deleteMaintenanceReport,
  });

export const useProjectsDropdown = ({ search = "", page = 1, limit = 1000 } = {}) =>
  useQuery({
    queryKey: ["projectsDropdown", search, page, limit],
    queryFn: () => getProjectsDropdown({ search, page, limit }),
  });
