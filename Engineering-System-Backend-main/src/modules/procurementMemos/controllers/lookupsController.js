import mongoose from "mongoose";
import CommitteeType from "../models/CommitteeType.js";
import OfferType from "../models/OfferType.js";
import DecisionReason from "../models/DecisionReason.js";
import FiscalYear from "../models/FiscalYear.js";
import ProcurementProject from "../models/ProcurementProject.js";
import ProcurementCompany from "../models/ProcurementCompany.js";
import Unit from "../models/Unit.js";
import { AppError } from "../../../utils/AppError.js";

// ─── Committee Types ──────────────────────────────────────────────────────────
export const getCommitteeTypes = async (req, res, next) => {
    try {
        const data = await CommitteeType.find().sort({ name: 1 });
        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const createCommitteeType = async (req, res, next) => {
    try {
        const { name } = req.body;
        const data = await CommitteeType.create({ name });
        res.status(201).json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── Offer Types ──────────────────────────────────────────────────────────────
export const getOfferTypes = async (req, res, next) => {
    try {
        const data = await OfferType.find().sort({ name: 1 });
        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const createOfferType = async (req, res, next) => {
    try {
        const { name } = req.body;
        const data = await OfferType.create({ name });
        res.status(201).json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── Decision Reasons ─────────────────────────────────────────────────────────
export const getDecisionReasons = async (req, res, next) => {
    try {
        const data = await DecisionReason.find().sort({ reasonText: 1 });
        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const createDecisionReason = async (req, res, next) => {
    try {
        const { reasonText } = req.body;
        const data = await DecisionReason.create({ reasonText });
        res.status(201).json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── Fiscal Years ─────────────────────────────────────────────────────────────
export const getFiscalYears = async (req, res, next) => {
    try {
        const data = await FiscalYear.find().sort({ yearLabel: -1 });
        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const createFiscalYear = async (req, res, next) => {
    try {
        const { yearLabel } = req.body;
        const data = await FiscalYear.create({ yearLabel });
        res.status(201).json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── Procurement Projects ─────────────────────────────────────────────────────
export const getProjects = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await ProcurementProject.countDocuments(query);
        const data = await ProcurementProject.find(query)
            .populate("branchId", "code name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            data: {
                projects: data,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    itemsPerPage: Number(limit),
                },
            },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const data = await ProcurementProject.findById(id).populate(
            "branchId",
            "code name"
        );
        if (!data) {
            return next(new AppError("المشروع غير موجود", 404));
        }

        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── Procurement Companies ────────────────────────────────────────────────────
export const getCompanies = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await ProcurementCompany.countDocuments(query);
        const data = await ProcurementCompany.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            data: {
                companies: data,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    itemsPerPage: Number(limit),
                },
            },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── Units ────────────────────────────────────────────────────────────────────
export const getUnits = async (req, res, next) => {
    try {
        const data = await Unit.find().sort({ name: 1 });
        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};