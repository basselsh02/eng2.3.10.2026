import express from "express";
import * as officeController from "../controllers/office.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get offices dropdown
router.get("/dropdown", officeController.getOfficesDropdown);

// Get offices stats
router.get("/stats", officeController.getOfficesStats);

// Main CRUD routes
router.route("/")
    .post(officeController.createOffice)
    .get(officeController.getAllOffices);

router.route("/:id")
    .get(officeController.getOfficeById)
    .patch(officeController.updateOffice)
    .delete(officeController.deleteOffice);

export default router;
