import express from "express";
import {
  createMaintenanceReport,
  deleteMaintenanceReport,
  getAllMaintenanceReports,
  getMaintenanceReportById,
  updateMaintenanceReport,
  exportToExcel,
} from "../controllers/maintenanceReport.controller.js";

const router = express.Router();

router.post("/export", exportToExcel);

router.route("/").get(getAllMaintenanceReports).post(createMaintenanceReport);
router
  .route("/:id")
  .get(getMaintenanceReportById)
  .put(updateMaintenanceReport)
  .patch(updateMaintenanceReport)
  .delete(deleteMaintenanceReport);

export default router;
