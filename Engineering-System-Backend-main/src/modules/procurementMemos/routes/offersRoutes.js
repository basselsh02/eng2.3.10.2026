import express from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
    updateOffer,
    getOfferItems,
    upsertOfferItems,
} from "../controllers/offersController.js";

const router = express.Router();

router.use(protect);

// PATCH /api/offers/:id
router.patch("/:id", updateOffer);

// GET  /api/offers/:id/item-details — بيان عرض الشركة من الاصناف
// POST /api/offers/:id/item-details
router
    .route("/:id/item-details")
    .get(getOfferItems)
    .post(upsertOfferItems);

export default router;