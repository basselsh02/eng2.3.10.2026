import express from "express";
import * as procedureController from "../controllers/procedure.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get procedures by project
router.get("/project/:projectId", procedureController.getProceduresByProject);

// Main CRUD routes
router.route("/")
    .post(procedureController.createProcedure)
    .get(procedureController.getAllProcedures);

router.route("/:id")
    .get(procedureController.getProcedureById)
    .patch(procedureController.updateProcedure)
    .delete(procedureController.deleteProcedure);

export default router;
