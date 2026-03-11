const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // existing auth middleware
const {
  getSupplyOrderById,
  createSupplyOrder,
  printSupplyOrderForm,
} = require('../controllers/supplyOrdersController');

const {
  updateCommitteeMember,
  deleteCommitteeMember,
} = require('../controllers/committeeMembersController');

// ─── Supply order CRUD ────────────────────────────────────────────────────────
router.route('/').post(protect, createSupplyOrder);
router.route('/:id').get(protect, getSupplyOrderById);

// ─── Print forms for supply orders ───────────────────────────────────────────
// Handles: print, form-19-1b, form-1b-1, treasury-report, size-report,
//          deductions-minutes
router.route('/:id/:form').get(protect, printSupplyOrderForm);

module.exports = router;
