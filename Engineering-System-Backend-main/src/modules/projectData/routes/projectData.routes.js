import express from "express";
import * as projectDataController from "../controllers/projectData.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// ── NEW route — must come BEFORE /:id ────────────────────────
// GET /api/project-data/by-code?projectCode=XXX&financialYear=2026/2025
router.get("/by-code", projectDataController.getProjectDataByCode);

// ── Existing routes (unchanged) ──────────────────────────────
router.route("/")
    .post(projectDataController.createProjectData)
    .get(projectDataController.getAllProjectData);

router.route("/:id")
    .get(projectDataController.getProjectDataById)
    .patch(projectDataController.updateProjectData)
    .delete(projectDataController.deleteProjectData);

// Sub-resource routes
router.post("/:id/work-items", projectDataController.addWorkItem);
router.post("/:id/candidate-companies", projectDataController.addCandidateCompany);
router.post("/:id/project-conditions", projectDataController.addProjectCondition);

export default router;
