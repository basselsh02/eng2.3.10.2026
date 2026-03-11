import express from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
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
} from "../controllers/lookupsController.js";

const router = express.Router();

router.use(protect);

router.route("/committee-types").get(getCommitteeTypes).post(createCommitteeType);
router.route("/offer-types").get(getOfferTypes).post(createOfferType);
router.route("/decision-reasons").get(getDecisionReasons).post(createDecisionReason);
router.route("/fiscal-years").get(getFiscalYears).post(createFiscalYear);
router.route("/procurement-projects").get(getProjects);
router.route("/procurement-projects/:id").get(getProjectById);
router.route("/procurement-companies").get(getCompanies);
router.route("/units").get(getUnits);

export default router;