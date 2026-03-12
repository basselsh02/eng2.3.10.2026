import express from "express";
import * as financialStatusController from "../controllers/financialStatus.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get financial statuses by project
router.get("/project/:projectId", financialStatusController.getFinancialStatusesByProject);

// Add event to financial status
router.post("/:id/events", financialStatusController.addEventToFinancialStatus);

// Main CRUD routes
router.post("/export", financialStatusController.exportToExcel);
router.route("/")
    .post(financialStatusController.createFinancialStatus)
    .get(financialStatusController.getAllFinancialStatuses);

router.route("/:id")
    .get(financialStatusController.getFinancialStatusById)
    .patch(financialStatusController.updateFinancialStatus)
    .delete(financialStatusController.deleteFinancialStatus);

export default router;
