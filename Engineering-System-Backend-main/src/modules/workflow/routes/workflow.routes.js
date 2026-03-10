import express from "express";
import * as workflowController from "../controllers/workflow.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get workflow statistics
router.get("/stats", workflowController.getWorkflowStats);

// Get workflow by processId
router.get("/process/:processId", workflowController.getWorkflowByProcessId);

// Main CRUD routes
router.route("/")
    .post(workflowController.createWorkflow)
    .get(workflowController.getAllWorkflows);

router.route("/:id")
    .get(workflowController.getWorkflowById)
    .patch(workflowController.updateWorkflow)
    .delete(workflowController.deleteWorkflow);

// Update stage state
router.patch("/:id/stages/:stageNumber", workflowController.updateStageState);

// Return stage
router.patch("/:id/stages/:stageNumber/return", workflowController.returnStage);

// Assignment history routes
router.get("/assignee-history/:workflowTemplateId/:officeId", workflowController.getSuggestedAssignee);
router.post("/assignee-history", workflowController.updateAssigneeHistory);
router.get("/assignee-history/office/:officeId", workflowController.getOfficeAssigneeHistory);

export default router;
