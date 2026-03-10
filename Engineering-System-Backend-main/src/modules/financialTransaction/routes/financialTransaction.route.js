import express from "express";
import * as financialTransactionController from "../controllers/financialTransaction.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Main CRUD routes
router.route("/")
    .post(financialTransactionController.createFinancialTransaction)
    .get(financialTransactionController.getAllFinancialTransactions);

router.route("/:id")
    .get(financialTransactionController.getFinancialTransactionById)
    .patch(financialTransactionController.updateFinancialTransaction)
    .delete(financialTransactionController.deleteFinancialTransaction);

// Get by project
router.get("/project/:projectId", financialTransactionController.getTransactionsByProject);

// Update specific sections
router.patch("/:id/company-offers-data", financialTransactionController.updateCompanyOffersData);
router.patch("/:id/technical-data", financialTransactionController.updateTechnicalData);
router.patch("/:id/financial-opening-data", financialTransactionController.updateFinancialOpeningData);
router.patch("/:id/financial-items", financialTransactionController.updateFinancialItems);

export default router;
