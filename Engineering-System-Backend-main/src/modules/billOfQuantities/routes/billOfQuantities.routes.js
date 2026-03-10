import express from "express";
import {
    createBillOfQuantities,
    getAllBillOfQuantities,
    getBillOfQuantitiesById,
    updateBillOfQuantities,
    deleteBillOfQuantities,
} from "../controllers/billOfQuantities.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";
import {
    validateBillOfQuantities,
    validate,
} from "../../../middleware/validators.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("admin", "super_admin"),
    validateBillOfQuantities(),
    validate,
    createBillOfQuantities
);

router.get("/", protect, getAllBillOfQuantities);

router.get("/:id", protect, getBillOfQuantitiesById);

router.put(
    "/:id",
    protect,
    authorize("admin", "super_admin"),
    validateBillOfQuantities(),
    validate,
    updateBillOfQuantities
);

router.delete(
    "/:id",
    protect,
    authorize("admin", "super_admin"),
    deleteBillOfQuantities
);

export default router;