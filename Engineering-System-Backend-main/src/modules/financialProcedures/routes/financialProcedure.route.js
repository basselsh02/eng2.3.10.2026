import express from "express";
import * as financialProcedureController from "../controllers/financialProcedure.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get financial procedures by project
router.get("/project/:projectId", financialProcedureController.getFinancialProceduresByProject);

// Main CRUD routes
router.route("/")
    .post(financialProcedureController.createFinancialProcedure)
    .get(financialProcedureController.getAllFinancialProcedures);

router.route("/:id")
    .get(financialProcedureController.getFinancialProcedureById)
    .patch(financialProcedureController.updateFinancialProcedure)
    .delete(financialProcedureController.deleteFinancialProcedure);

export default router;
