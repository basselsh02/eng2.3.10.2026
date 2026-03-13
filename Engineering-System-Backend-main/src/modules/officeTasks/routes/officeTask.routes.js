import express from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
  getOfficeTasks,
  createOfficeTask,
  assignEmployee,
  assignAllEmployees,
  updateOfficeTask,
} from "../controllers/officeTask.controller.js";

const router = express.Router();

router.get("/", protect, getOfficeTasks);
router.post("/", protect, createOfficeTask);
router.patch("/:id/assign", protect, assignEmployee);
router.patch("/:id/assign-all", protect, assignAllEmployees);
router.patch("/:id", protect, updateOfficeTask);

export default router;
