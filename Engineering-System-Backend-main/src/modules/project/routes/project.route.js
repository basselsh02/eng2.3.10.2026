import express from "express";
import * as projectController from "../controllers/project.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // All project routes are protected

router.route("/")
    .post(projectController.createProject)
    .get(projectController.getAllProjects);

router.route("/:id")
    .get(projectController.getProjectById)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject);

export default router;
