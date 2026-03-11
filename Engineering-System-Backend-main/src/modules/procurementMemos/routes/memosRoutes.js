import express from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
    getMemos,
    getMemoById,
    createMemo,
    updateMemo,
    getCompanyOffers,
    addCompanyOffer,
    getTechnicalOpeningProcedures,
    getTechnicalDecisionProcedures,
    getFinancialOpeningProcedures,
    triggerAccountingReview,
    getFinancialDecisionProcedures,
    registerFinancialWinner,
    distributeCompanies,
    getSupplyOrder,
    printMemoForm,
} from "../controllers/memosController.js";
import {
    getCommitteeMembers,
    addCommitteeMember,
} from "../controllers/committeeMembersController.js";

const router = express.Router();

// All routes protected
router.use(protect);

// ── Memo CRUD ─────────────────────────────────────────────────────────────────
router.route("/").get(getMemos).post(createMemo);
router.route("/:id").get(getMemoById).patch(updateMemo);

// ── Tab: عروض الشركات ─────────────────────────────────────────────────────────
router.route("/:id/company-offers").get(getCompanyOffers).post(addCompanyOffer);

// ── Tab: اجراءات الفتح الفني ──────────────────────────────────────────────────
router.get("/:id/opening-procedures", getTechnicalOpeningProcedures);

// ── Tab: اجراءات البت الفني ───────────────────────────────────────────────────
router.get("/:id/decision-procedures", getTechnicalDecisionProcedures);

// ── Tab: اجراءات الفتح المالي ─────────────────────────────────────────────────
router.get("/:id/financial-opening", getFinancialOpeningProcedures);
router.post("/:id/accounting-review", triggerAccountingReview);

// ── Tab: اجراءات البت المالي ──────────────────────────────────────────────────
router.get("/:id/financial-decision", getFinancialDecisionProcedures);
router.post("/:id/register-financial-winner", registerFinancialWinner);
router.post("/:id/distribute-companies", distributeCompanies);

// ── Tab: أمر التوريد ──────────────────────────────────────────────────────────
router.get("/:id/supply-order", getSupplyOrder);

// ── Committee members (nested under memo) ─────────────────────────────────────
router
    .route("/:id/committee-members")
    .get(getCommitteeMembers)
    .post(addCommitteeMember);

// ── Print forms ───────────────────────────────────────────────────────────────
// Supported: form-6a, form-6b, form-6c, form-7, form-9, form-10a, form-10b,
//            form-1a, decision-letter, committee-letter, form-12a, form-12b,
//            182-12, form-16b-182, technical-opening-request, form-19,
//            form-19b, form-16b-2, minutes-1, minutes-2, 15-182
router.get("/:id/print/:form", printMemoForm);

export default router;