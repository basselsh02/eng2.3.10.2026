import express from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
    getSupplyOrderById,
    createSupplyOrder,
    printSupplyOrderForm,
} from "../controllers/supplyOrdersController.js";

const router = express.Router();

router.use(protect);

// POST /api/supply-orders
router.post("/", createSupplyOrder);

// GET /api/supply-orders/:id
router.get("/:id", getSupplyOrderById);

// GET /api/supply-orders/:id/:form
// Supported: print, form-19-1b, form-1b-1, treasury-report,
//            size-report, deductions-minutes
router.get("/:id/:form", printSupplyOrderForm);

export default router;