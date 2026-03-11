const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // existing auth middleware
const {
  getMemos,
  getMemoById,
  createMemo,
  updateMemo,
  getCompanyOffers,
  addCompanyOffer,
  updateOffer,
  getOfferItems,
  upsertOfferItems,
  getTechnicalOpeningProcedures,
  getTechnicalDecisionProcedures,
  getFinancialOpeningProcedures,
  triggerAccountingReview,
  getFinancialDecisionProcedures,
  registerFinancialWinner,
  distributeCompanies,
  getSupplyOrder,
  printMemoForm,
} = require('../controllers/memosController');

const {
  getCommitteeMembers,
  addCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
} = require('../controllers/committeeMembersController');

// ─── Memo CRUD ────────────────────────────────────────────────────────────────
router.route('/').get(protect, getMemos).post(protect, createMemo);

router.route('/:id').get(protect, getMemoById).patch(protect, updateMemo);

// ─── Tab: عروض الشركات ────────────────────────────────────────────────────────
router
  .route('/:id/company-offers')
  .get(protect, getCompanyOffers)
  .post(protect, addCompanyOffer);

// ─── Tab: اجراءات الفتح الفني ─────────────────────────────────────────────────
router.route('/:id/opening-procedures').get(protect, getTechnicalOpeningProcedures);

// ─── Tab: اجراءات البت الفني ──────────────────────────────────────────────────
router.route('/:id/decision-procedures').get(protect, getTechnicalDecisionProcedures);

// ─── Tab: اجراءات الفتح المالي ────────────────────────────────────────────────
router.route('/:id/financial-opening').get(protect, getFinancialOpeningProcedures);
router.route('/:id/accounting-review').post(protect, triggerAccountingReview);

// ─── Tab: اجراءات البت المالي ─────────────────────────────────────────────────
router.route('/:id/financial-decision').get(protect, getFinancialDecisionProcedures);
router.route('/:id/register-financial-winner').post(protect, registerFinancialWinner);
router.route('/:id/distribute-companies').post(protect, distributeCompanies);

// ─── Tab: أمر التوريد ─────────────────────────────────────────────────────────
router.route('/:id/supply-order').get(protect, getSupplyOrder);

// ─── Committee members (nested under memo) ────────────────────────────────────
router
  .route('/:id/committee-members')
  .get(protect, getCommitteeMembers)
  .post(protect, addCommitteeMember);

// ─── Print forms for memo ─────────────────────────────────────────────────────
// Handles: form-6a, form-6b, form-6c, form-7, form-9, form-10a, form-10b,
//          form-1a, decision-letter, committee-letter, form-12a, form-12b,
//          182-12, form-16b-182, technical-opening-request, form-19,
//          form-19b, form-16b-2, minutes-1, minutes-2, 15-182
router.route('/:id/print/:form').get(protect, printMemoForm);

module.exports = router;
