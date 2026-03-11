const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // existing auth middleware
const {
  updateCommitteeMember,
  deleteCommitteeMember,
} = require('../controllers/committeeMembersController');

// ─── Standalone member update / delete by member ObjectId ────────────────────
router
  .route('/:id')
  .patch(protect, updateCommitteeMember)
  .delete(protect, deleteCommitteeMember);

module.exports = router;
