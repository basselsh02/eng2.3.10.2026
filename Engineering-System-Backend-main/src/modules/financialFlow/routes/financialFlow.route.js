import express from "express";
import * as financialFlowController from "../controllers/financialFlow.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Main CRUD routes
router.route("/")
    .post(financialFlowController.createFinancialFlow)
    .get(financialFlowController.getAllFinancialFlows);

router.route("/:id")
    .get(financialFlowController.getFinancialFlowById)
    .patch(financialFlowController.updateFinancialFlow)
    .delete(financialFlowController.deleteFinancialFlow);

// Get by project
router.get("/project/:projectId", financialFlowController.getFinancialFlowsByProject);

// Update specific tabs
router.patch("/:id/company-offers", financialFlowController.updateCompanyOffers);
router.patch("/:id/technical-procedures", financialFlowController.updateTechnicalProcedures);
router.patch("/:id/financial-opening", financialFlowController.updateFinancialOpening);
router.patch("/:id/current-financial", financialFlowController.updateCurrentFinancial);

export default router;
