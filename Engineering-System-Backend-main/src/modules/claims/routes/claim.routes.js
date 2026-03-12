import { Router } from "express";
import { createClaim, getClaims, updateClaim } from "../controllers/claim.controller.js";

const router = Router();

router.get("/", getClaims);
router.post("/", createClaim);
router.patch("/:id", updateClaim);

export default router;
