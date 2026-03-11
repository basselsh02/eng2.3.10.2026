import express from "express";
import {
  createMaintenanceReport,
  deleteMaintenanceReport,
  getAllMaintenanceReports,
  getMaintenanceReportById,
  updateMaintenanceReport,
} from "../controllers/maintenanceReport.controller.js";

const router = express.Router();

router.route("/").get(getAllMaintenanceReports).post(createMaintenanceReport);
router
  .route("/:id")
  .get(getMaintenanceReportById)
  .put(updateMaintenanceReport)
  .patch(updateMaintenanceReport)
  .delete(deleteMaintenanceReport);

export default router;
