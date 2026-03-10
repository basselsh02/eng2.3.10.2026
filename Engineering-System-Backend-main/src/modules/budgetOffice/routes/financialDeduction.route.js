import express from "express";
import * as financialDeductionController from "../controllers/financialDeduction.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Main CRUD routes
router.route("/")
    .post(financialDeductionController.createFinancialDeduction)
    .get(financialDeductionController.getAllFinancialDeductions);

router.route("/:id")
    .get(financialDeductionController.getFinancialDeductionById)
    .patch(financialDeductionController.updateFinancialDeduction)
    .delete(financialDeductionController.deleteFinancialDeduction);

// Get by project
router.get("/project/:projectId", financialDeductionController.getDeductionsByProject);

// Statistics
router.get("/stats/summary", financialDeductionController.getDeductionStatistics);

// Workflow actions
router.patch("/:id/review", financialDeductionController.reviewDeduction);
router.patch("/:id/approve", financialDeductionController.approveDeduction);
router.patch("/:id/reject", financialDeductionController.rejectDeduction);
router.patch("/:id/mark-paid", financialDeductionController.markAsPaid);

export default router;
