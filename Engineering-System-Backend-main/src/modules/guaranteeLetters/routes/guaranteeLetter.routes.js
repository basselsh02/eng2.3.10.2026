import { Router } from "express";
import {
  bulkRenewGuaranteeLetters,
  createGuaranteeLetter,
  getGuaranteeLetters,
  renewGuaranteeLetter,
  updateGuaranteeLetter,
} from "../controllers/guaranteeLetter.controller.js";

const router = Router();

router.get("/", getGuaranteeLetters);
router.post("/", createGuaranteeLetter);
router.patch("/:id", updateGuaranteeLetter);
router.post("/:id/renew", renewGuaranteeLetter);
router.post("/bulk-renew", bulkRenewGuaranteeLetters);

export default router;
