import CommitteeMember from '../models/CommitteeMember';
import Memo from '../models/Memo';

// ─── GET /api/memos/:id/committee-members ────────────────────────────────────
export const getCommitteeMembers = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const data = await CommitteeMember.find({ memoId: req.params.id })
      .populate('roleId', 'name')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/memos/:id/committee-members ───────────────────────────────────
export const addCommitteeMember = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const { name, rank, roleId, isActive, hasSigned } = req.body;

    const member = await CommitteeMember.create({
      memoId: req.params.id,
      name,
      rank,
      roleId,
      isActive: isActive !== undefined ? isActive : true,
      hasSigned: hasSigned !== undefined ? hasSigned : false,
    });

    const populated = await CommitteeMember.findById(member._id).populate('roleId', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── PATCH /api/committee-members/:id ────────────────────────────────────────
export const updateCommitteeMember = async (req, res) => {
  try {
    const allowedFields = ['name', 'rank', 'roleId', 'isActive', 'hasSigned'];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const member = await CommitteeMember.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('roleId', 'name');

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/committee-members/:id ───────────────────────────────────────
export const deleteCommitteeMember = async (req, res) => {
  try {
    const member = await CommitteeMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }
    res.status(200).json({ success: true, message: 'Committee member deleted', data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
