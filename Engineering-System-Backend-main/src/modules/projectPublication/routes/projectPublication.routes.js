import express from "express";
import * as projectPublicationController from "../controllers/projectPublication.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .post(projectPublicationController.createProjectPublication)
    .get(projectPublicationController.getAllProjectPublications);

router.route("/:id")
    .get(projectPublicationController.getProjectPublicationById)
    .patch(projectPublicationController.updateProjectPublication)
    .delete(projectPublicationController.deleteProjectPublication);

export default router;
