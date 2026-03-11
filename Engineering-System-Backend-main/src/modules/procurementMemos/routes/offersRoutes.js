const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // existing auth middleware
const {
  updateOffer,
  getOfferItems,
  upsertOfferItems,
} = require('../controllers/memosController');

// ─── PATCH /api/offers/:id — update offer (decision, discount, financial values, etc.)
router.route('/:id').patch(protect, updateOffer);

// ─── GET  /api/offers/:id/item-details — بيان عرض الشركة من الاصناف
// ─── POST /api/offers/:id/item-details — add/replace offer items
router
  .route('/:id/item-details')
  .get(protect, getOfferItems)
  .post(protect, upsertOfferItems);

module.exports = router;
