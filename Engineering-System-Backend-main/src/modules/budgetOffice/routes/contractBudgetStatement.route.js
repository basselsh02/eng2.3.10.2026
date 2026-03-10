import express from "express";
import * as contractBudgetStatementController from "../controllers/contractBudgetStatement.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Main CRUD routes
router.route("/")
    .post(contractBudgetStatementController.createContractBudgetStatement)
    .get(contractBudgetStatementController.getAllContractBudgetStatements);

router.route("/:id")
    .get(contractBudgetStatementController.getContractBudgetStatementById)
    .patch(contractBudgetStatementController.updateContractBudgetStatement)
    .delete(contractBudgetStatementController.deleteContractBudgetStatement);

// Get by project
router.get("/project/:projectId", contractBudgetStatementController.getStatementsByProject);

// Update specific tabs
router.patch("/:id/project-data", contractBudgetStatementController.updateProjectData);
router.patch("/:id/contractual-data", contractBudgetStatementController.updateContractualData);
router.patch("/:id/disbursement-data", contractBudgetStatementController.updateDisbursementData);
router.patch("/:id/materials-disbursement", contractBudgetStatementController.updateMaterialsDisbursement);

// Approval workflow
router.patch("/:id/approve", contractBudgetStatementController.approveStatement);
router.patch("/:id/reject", contractBudgetStatementController.rejectStatement);

export default router;
