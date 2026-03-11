const express = require('express');
const router = express.Router();
const memosController = require('./memosController');
const { authenticate } = require('../middleware/auth'); // Adjust path as needed

// Apply authentication middleware to all routes
router.use(authenticate);

// ============ MEMO ROUTES ============
router.get('/memos', memosController.listMemos);
router.get('/memos/:id', memosController.getMemo);
router.post('/memos', memosController.createMemo);
router.patch('/memos/:id', memosController.updateMemo);
router.delete('/memos/:id', memosController.deleteMemo);

// ============ COMPANY OFFERS ROUTES ============
router.get('/memos/:id/company-offers', memosController.getCompanyOffers);
router.post('/memos/:id/company-offers', memosController.createCompanyOffer);
router.patch('/offers/:id', memosController.updateOffer);
router.delete('/offers/:id', memosController.deleteOffer);

// ============ OFFER ITEMS ROUTES ============
router.get('/offers/:id/item-details', memosController.getOfferItems);
router.post('/offers/:id/item-details', memosController.upsertOfferItems);

// ============ COMMITTEE MEMBERS ROUTES ============
router.get('/memos/:id/committee-members', memosController.getCommitteeMembers);
router.post('/memos/:id/committee-members', memosController.addCommitteeMembers);
router.patch('/committee-members/:id', memosController.updateCommitteeMember);

// ============ SUPPLY ORDERS ROUTES ============
router.get('/supply-orders/:id', memosController.getSupplyOrder);
router.post('/supply-orders', memosController.createSupplyOrder);
router.patch('/supply-orders/:id', memosController.updateSupplyOrder);

// ============ WORKFLOW STAGE ROUTES ============
router.get('/memo/:id/opening-procedures', memosController.getOpeningProcedures);
router.get('/memo/:id/decision-procedures', memosController.getDecisionProcedures);
router.get('/memo/:id/financial-opening', memosController.getFinancialOpening);
router.get('/memo/:id/financial-decision', memosController.getFinancialDecision);
router.post('/memo/:id/register-financial-winner', memosController.registerFinancialWinner);

// ============ LOOKUP DATA ROUTES ============
router.get('/committee-types', memosController.getCommitteeTypes);
router.get('/offer-types', memosController.getOfferTypes);
router.get('/decision-reasons', memosController.getDecisionReasons);
router.get('/committee-roles', memosController.getCommitteeRoles);
router.get('/fiscal-years', memosController.getFiscalYears);
router.get('/units', memosController.getUnits);
router.get('/category-groups', memosController.getCategoryGroups);

// ============ PDF GENERATION ROUTES ============
router.get('/memo/:id/print/:form', memosController.printForm);

module.exports = router;
