import express from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import {
    updateCommitteeMember,
    deleteCommitteeMember,
} from "../controllers/committeeMembersController.js";

const router = express.Router();

router.use(protect);

// PATCH /api/committee-members/:id
// DELETE /api/committee-members/:id
router
    .route("/:id")
    .patch(updateCommitteeMember)
    .delete(deleteCommitteeMember);

export default router;