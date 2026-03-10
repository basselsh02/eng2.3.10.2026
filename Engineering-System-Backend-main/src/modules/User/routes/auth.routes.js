// src/modules/auth/routes/auth.routes.js
import express from "express";


import { assignPermissions, getUserByToken, login } from "../controllers/auth.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getUserByToken);
router.patch("/users/:userId/permissions", protect, authorize("users:edit"), assignPermissions);

export default router;