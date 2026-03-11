const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // existing auth middleware
const {
  getCommitteeTypes,
  createCommitteeType,
  getOfferTypes,
  createOfferType,
  getDecisionReasons,
  createDecisionReason,
  getFiscalYears,
  createFiscalYear,
  getProjects,
  getProjectById,
  getCompanies,
  getUnits,
} = require('../controllers/lookupsController');

// Committee types
router.route('/committee-types').get(protect, getCommitteeTypes).post(protect, createCommitteeType);

// Offer types
router.route('/offer-types').get(protect, getOfferTypes).post(protect, createOfferType);

// Decision reasons
router
  .route('/decision-reasons')
  .get(protect, getDecisionReasons)
  .post(protect, createDecisionReason);

// Fiscal years
router.route('/fiscal-years').get(protect, getFiscalYears).post(protect, createFiscalYear);

// Projects
router.route('/projects').get(protect, getProjects);
router.route('/projects/:id').get(protect, getProjectById);

// Companies
router.route('/companies').get(protect, getCompanies);

// Units
router.route('/units').get(protect, getUnits);

module.exports = router;
