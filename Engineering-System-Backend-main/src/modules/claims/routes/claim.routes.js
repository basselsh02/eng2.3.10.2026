import { Router } from "express";
import { createClaim, getClaims, updateClaim, exportToExcel } from "../controllers/claim.controller.js";

const router = Router();

router.get("/", getClaims);
router.post("/export", exportToExcel);
router.post("/", createClaim);
router.patch("/:id", updateClaim);

export default router;
