import mongoose from "mongoose";
import CommitteeMember from "../models/CommitteeMember.js";
import Memo from "../models/Memo.js";
import { AppError } from "../../../utils/AppError.js";

// ─── GET /api/memos/:id/committee-members ────────────────────────────────────
export const getCommitteeMembers = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id);
        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const data = await CommitteeMember.find({ memoId: id })
            .populate("roleId", "name")
            .sort({ createdAt: 1 });

        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── POST /api/memos/:id/committee-members ───────────────────────────────────
export const addCommitteeMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id);
        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const { name, rank, roleId, isActive, hasSigned } = req.body;

        const member = await CommitteeMember.create({
            memoId: id,
            name,
            rank,
            roleId,
            isActive: isActive !== undefined ? isActive : true,
            hasSigned: hasSigned !== undefined ? hasSigned : false,
        });

        const populated = await CommitteeMember.findById(member._id).populate(
            "roleId",
            "name"
        );

        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── PATCH /api/committee-members/:id ────────────────────────────────────────
export const updateCommitteeMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const allowedFields = ["name", "rank", "roleId", "isActive", "hasSigned"];
        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const member = await CommitteeMember.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate("roleId", "name");

        if (!member) {
            return next(new AppError("عضو اللجنة غير موجود", 404));
        }

        res.json({ success: true, data: member });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── DELETE /api/committee-members/:id ───────────────────────────────────────
export const deleteCommitteeMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const member = await CommitteeMember.findByIdAndDelete(id);
        if (!member) {
            return next(new AppError("عضو اللجنة غير موجود", 404));
        }

        res.json({ success: true, message: "تم حذف عضو اللجنة", data: member });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};