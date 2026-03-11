import express from "express";
import * as procedureController from "../controllers/procedure.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get procedures by project
router.get("/project/:projectId", procedureController.getProceduresByProject);


// Procedures page company offers by project code
router.get('/:code/company-offers', procedureController.getProcedureCompanyOffersByProjectCode);
router.put('/:code/company-offers/:offerId', procedureController.updateProcedureCompanyOffer);
router.patch('/:code/company-offers/:offerId', procedureController.updateProcedureCompanyOffer);

// Main CRUD routes
router.route("/")
    .post(procedureController.createProcedure)
    .get(procedureController.getAllProcedures);

router.route("/:id")
    .get(procedureController.getProcedureById)
    .patch(procedureController.updateProcedure)
    .delete(procedureController.deleteProcedure);

export default router;
