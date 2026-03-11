import mongoose from "mongoose";
import Memo from "../models/Memo.js";
import CommitteeMember from "../models/CommitteeMember.js";
import Offer from "../models/Offer.js";
import OfferItem from "../models/OfferItem.js";
import SupplyOrder from "../models/SupplyOrder.js";
import SupplyOrderItem from "../models/SupplyOrderItem.js";
import BudgetAllocation from "../models/BudgetAllocation.js";
import { AppError } from "../../../utils/AppError.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const computeOfferFields = (offer) => {
    const base = offer.financialValue || 0;
    const valueAfterDiscount =
        base - (base * (offer.discountPercentage || 0)) / 100;
    return {
        ...offer.toObject(),
        valueAfterDiscount: Math.round(valueAfterDiscount * 100) / 100,
    };
};

const computeItemFields = (item) => {
    const priceAfterDiscount = (item.unitPrice || 0) - (item.discount || 0);
    const total = (item.quantity || 0) * priceAfterDiscount;
    const financialPriceAfterDiscount =
        (item.companyPrice || 0) - (item.discountAmount || 0);
    const financialTotal = (item.quantity || 0) * financialPriceAfterDiscount;
    return {
        ...item.toObject(),
        priceAfterDiscount: Math.round(priceAfterDiscount * 100) / 100,
        total: Math.round(total * 100) / 100,
        financialPriceAfterDiscount:
            Math.round(financialPriceAfterDiscount * 100) / 100,
        financialTotal: Math.round(financialTotal * 100) / 100,
    };
};

const buildFullMemo = async (memo) => {
    const [members, offers] = await Promise.all([
        CommitteeMember.find({ memoId: memo._id })
            .populate("roleId", "name")
            .sort({ createdAt: 1 }),
        Offer.find({ memoId: memo._id })
            .populate("companyId", "code name")
            .populate("offerTypeId", "name")
            .populate("rulingId", "reasonText")
            .sort({ sequenceNumber: 1 }),
    ]);

    const offersWithItems = await Promise.all(
        offers.map(async (offer) => {
            const items = await OfferItem.find({ offerId: offer._id })
                .populate("unitId", "name symbol")
                .populate("reasonId", "reasonText")
                .sort({ itemNumber: 1 });
            return {
                ...computeOfferFields(offer),
                items: items.map(computeItemFields),
            };
        })
    );

    return {
        ...memo.toObject(),
        committeeMembers: members,
        offers: offersWithItems,
    };
};

// ─── GET /api/memos ───────────────────────────────────────────────────────────
export const getMemos = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { refNumber: { $regex: search, $options: "i" } },
                { documentType: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Memo.countDocuments(query);
        const memos = await Memo.find(query)
            .populate("fiscalYear", "yearLabel")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            })
            .populate("committeeTypeId", "name")
            .populate("financialWinnerId", "code name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            data: {
                memos,
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

// ─── GET /api/memos/:id ───────────────────────────────────────────────────────
export const getMemoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id)
            .populate("fiscalYear", "yearLabel")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            })
            .populate("committeeTypeId", "name")
            .populate("financialWinnerId", "code name");

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const data = await buildFullMemo(memo);
        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── POST /api/memos ──────────────────────────────────────────────────────────
export const createMemo = async (req, res, next) => {
    try {
        const {
            refNumber,
            documentType,
            fiscalYear,
            projectId,
            committeeTypeId,
            committeeDate,
            committeeStatement,
        } = req.body;

        const memo = await Memo.create({
            refNumber,
            documentType,
            fiscalYear,
            projectId,
            committeeTypeId,
            committeeDate,
            committeeStatement,
        });

        const populated = await Memo.findById(memo._id)
            .populate("fiscalYear", "yearLabel")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            })
            .populate("committeeTypeId", "name");

        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── PATCH /api/memos/:id ─────────────────────────────────────────────────────
export const updateMemo = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const allowedFields = [
            "refNumber",
            "documentType",
            "fiscalYear",
            "projectId",
            "committeeTypeId",
            "committeeDate",
            "committeeStatement",
            "currentStage",
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const memo = await Memo.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })
            .populate("fiscalYear", "yearLabel")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            })
            .populate("committeeTypeId", "name")
            .populate("financialWinnerId", "code name");

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        res.json({ success: true, data: memo });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── GET /api/memos/:id/company-offers ───────────────────────────────────────
export const getCompanyOffers = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id);
        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const offers = await Offer.find({ memoId: id })
            .populate("companyId", "code name")
            .populate("offerTypeId", "name")
            .sort({ sequenceNumber: 1 });

        const offersWithItems = await Promise.all(
            offers.map(async (offer) => {
                const items = await OfferItem.find({ offerId: offer._id })
                    .populate("unitId", "name symbol")
                    .populate("reasonId", "reasonText")
                    .sort({ itemNumber: 1 });
                return {
                    ...computeOfferFields(offer),
                    items: items.map(computeItemFields),
                };
            })
        );

        res.json({ success: true, data: offersWithItems });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── POST /api/memos/:id/company-offers ──────────────────────────────────────
export const addCompanyOffer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id);
        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const {
            companyId,
            offerTypeId,
            sequenceNumber,
            offerNumber,
            sequenceOrder,
            submissionDate,
            expiryDate,
            securityApprovalNumber,
            bidBondDetails,
            bidBondDate,
            documentCount,
        } = req.body;

        const offer = await Offer.create({
            memoId: id,
            companyId,
            offerTypeId,
            sequenceNumber,
            offerNumber,
            sequenceOrder,
            submissionDate,
            expiryDate,
            securityApprovalNumber,
            bidBondDetails,
            bidBondDate,
            documentCount,
        });

        const populated = await Offer.findById(offer._id)
            .populate("companyId", "code name")
            .populate("offerTypeId", "name");

        res.status(201).json({
            success: true,
            data: computeOfferFields(populated),
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── PATCH /api/offers/:id ────────────────────────────────────────────────────
export const updateOffer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const allowedFields = [
            "companyId",
            "offerTypeId",
            "sequenceNumber",
            "offerNumber",
            "sequenceOrder",
            "submissionDate",
            "expiryDate",
            "securityApprovalNumber",
            "bidBondDetails",
            "bidBondDate",
            "documentCount",
            "financialDocsStatus",
            "financialValue",
            "itemNumbers",
            "reviewedValue",
            "discountPercentage",
            "isExcluded",
            "committeeDecision",
            "technicalDecisionDate",
            "rulingId",
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const offer = await Offer.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })
            .populate("companyId", "code name")
            .populate("offerTypeId", "name")
            .populate("rulingId", "reasonText");

        if (!offer) {
            return next(new AppError("العرض غير موجود", 404));
        }

        res.json({ success: true, data: computeOfferFields(offer) });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── GET /api/offers/:id/item-details ────────────────────────────────────────
export const getOfferItems = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const offer = await Offer.findById(id);
        if (!offer) {
            return next(new AppError("العرض غير موجود", 404));
        }

        const items = await OfferItem.find({ offerId: id })
            .populate("unitId", "name symbol")
            .populate("reasonId", "reasonText")
            .sort({ itemNumber: 1 });

        const computed = items.map(computeItemFields);
        const grandTotal = computed.reduce((sum, item) => sum + (item.total || 0), 0);

        res.json({ success: true, data: computed, grandTotal });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── POST /api/offers/:id/item-details ───────────────────────────────────────
export const upsertOfferItems = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const offer = await Offer.findById(id);
        if (!offer) {
            return next(new AppError("العرض غير موجود", 404));
        }

        const { items } = req.body;
        if (!Array.isArray(items)) {
            return next(new AppError("items يجب أن يكون مصفوفة", 400));
        }

        await OfferItem.deleteMany({ offerId: id });
        await OfferItem.insertMany(
            items.map((item) => ({ ...item, offerId: id }))
        );

        const populated = await OfferItem.find({ offerId: id })
            .populate("unitId", "name symbol")
            .populate("reasonId", "reasonText")
            .sort({ itemNumber: 1 });

        const computed = populated.map(computeItemFields);
        const grandTotal = computed.reduce((sum, item) => sum + (item.total || 0), 0);

        res.status(201).json({ success: true, data: computed, grandTotal });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── GET /api/memos/:id/opening-procedures ───────────────────────────────────
export const getTechnicalOpeningProcedures = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id)
            .populate("fiscalYear", "yearLabel")
            .populate("committeeTypeId", "name")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            });

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const [members, offers] = await Promise.all([
            CommitteeMember.find({ memoId: id })
                .populate("roleId", "name")
                .sort({ createdAt: 1 }),
            Offer.find({ memoId: id })
                .populate("companyId", "code name")
                .populate("offerTypeId", "name")
                .sort({ sequenceNumber: 1 }),
        ]);

        res.json({ success: true, data: { memo, committeeMembers: members, offers } });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── GET /api/memos/:id/decision-procedures ──────────────────────────────────
export const getTechnicalDecisionProcedures = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id)
            .populate("fiscalYear", "yearLabel")
            .populate("committeeTypeId", "name")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            });

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const [members, offers] = await Promise.all([
            CommitteeMember.find({ memoId: id })
                .populate("roleId", "name")
                .sort({ createdAt: 1 }),
            Offer.find({ memoId: id })
                .populate("companyId", "code name")
                .populate("offerTypeId", "name")
                .populate("rulingId", "reasonText")
                .sort({ sequenceNumber: 1 }),
        ]);

        const offersWithItems = await Promise.all(
            offers.map(async (offer) => {
                const items = await OfferItem.find({ offerId: offer._id })
                    .populate("unitId", "name symbol")
                    .populate("reasonId", "reasonText")
                    .sort({ itemNumber: 1 });
                return {
                    ...computeOfferFields(offer),
                    items: items.map(computeItemFields),
                };
            })
        );

        res.json({
            success: true,
            data: { memo, committeeMembers: members, offers: offersWithItems },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── GET /api/memos/:id/financial-opening ────────────────────────────────────
export const getFinancialOpeningProcedures = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id)
            .populate("fiscalYear", "yearLabel")
            .populate("committeeTypeId", "name")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            });

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const [members, offers] = await Promise.all([
            CommitteeMember.find({ memoId: id })
                .populate("roleId", "name")
                .sort({ createdAt: 1 }),
            Offer.find({ memoId: id })
                .populate("companyId", "code name")
                .populate("offerTypeId", "name")
                .sort({ sequenceNumber: 1 }),
        ]);

        res.json({
            success: true,
            data: {
                memo,
                committeeMembers: members,
                offers: offers.map(computeOfferFields),
            },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── POST /api/memos/:id/accounting-review ───────────────────────────────────
export const triggerAccountingReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id);
        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        // TODO: integrate with accounting review workflow
        res.json({
            success: true,
            message: "تم تشغيل المراجعة المحاسبية بنجاح",
            data: { memoId: id },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── GET /api/memos/:id/financial-decision ───────────────────────────────────
export const getFinancialDecisionProcedures = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id)
            .populate("fiscalYear", "yearLabel")
            .populate("committeeTypeId", "name")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            });

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const [members, offers] = await Promise.all([
            CommitteeMember.find({ memoId: id })
                .populate("roleId", "name")
                .sort({ createdAt: 1 }),
            Offer.find({ memoId: id })
                .populate("companyId", "code name")
                .populate("offerTypeId", "name")
                .sort({ sequenceNumber: 1 }),
        ]);

        const offersWithItems = await Promise.all(
            offers.map(async (offer) => {
                const items = await OfferItem.find({ offerId: offer._id })
                    .populate("unitId", "name symbol")
                    .sort({ itemNumber: 1 });

                const computedItems = items.map((item) => {
                    const priceAfterDiscount =
                        (item.companyPrice || 0) - (item.discountAmount || 0);
                    const total = (item.quantity || 0) * priceAfterDiscount;
                    return {
                        ...item.toObject(),
                        priceAfterDiscount: Math.round(priceAfterDiscount * 100) / 100,
                        total: Math.round(total * 100) / 100,
                    };
                });

                const itemsGrandTotal = computedItems.reduce(
                    (sum, i) => sum + (i.total || 0),
                    0
                );

                return {
                    ...computeOfferFields(offer),
                    items: computedItems,
                    itemsGrandTotal: Math.round(itemsGrandTotal * 100) / 100,
                };
            })
        );

        res.json({
            success: true,
            data: { memo, committeeMembers: members, offers: offersWithItems },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── POST /api/memos/:id/register-financial-winner ───────────────────────────
export const registerFinancialWinner = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const { companyId } = req.body;
        if (!companyId) {
            return next(new AppError("companyId مطلوب", 400));
        }

        const memo = await Memo.findByIdAndUpdate(
            id,
            {
                financialWinnerId: companyId,
                financialWinnerRegisteredAt: new Date(),
            },
            { new: true, runValidators: true }
        )
            .populate("financialWinnerId", "code name")
            .populate("fiscalYear", "yearLabel");

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        res.json({
            success: true,
            message: "تم تسجيل الفائز المالي بنجاح",
            data: memo,
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

// ─── POST /api/memos/:id/distribute-companies ────────────────────────────────
export const distributeCompanies = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id);
        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        // TODO: implement distribution logic (stage 1)
        res.json({
            success: true,
            message: "تم توزيع الشركات بنجاح",
            data: { memoId: id },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── GET /api/memos/:id/supply-order ─────────────────────────────────────────
export const getSupplyOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const memo = await Memo.findById(id)
            .populate("fiscalYear", "yearLabel")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            });

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const supplyOrder = await SupplyOrder.findOne({ memoId: id })
            .populate("companyId", "code name")
            .populate("categoryGroupId", "name symbol");

        let supplyOrderData = null;
        if (supplyOrder) {
            const items = await SupplyOrderItem.find({ orderId: supplyOrder._id })
                .populate("unitId", "name symbol")
                .sort({ itemNumber: 1 });

            const computedItems = items.map((item) => ({
                ...item.toObject(),
                total: Math.round(
                    (item.quantity || 0) * (item.unitPrice || 0) * 100
                ) / 100,
            }));

            const totalValue = computedItems.reduce(
                (sum, i) => sum + (i.total || 0),
                0
            );
            const valueAfterDiscount =
                totalValue -
                (totalValue * (supplyOrder.discountPercentage || 0)) / 100;
            const guaranteeValue =
                (valueAfterDiscount * (supplyOrder.guaranteePercentage || 0)) / 100;

            supplyOrderData = {
                ...supplyOrder.toObject(),
                items: computedItems,
                totalValue: Math.round(totalValue * 100) / 100,
                valueAfterDiscount: Math.round(valueAfterDiscount * 100) / 100,
                guaranteeValue: Math.round(guaranteeValue * 100) / 100,
            };
        }

        const budgetAllocations = await BudgetAllocation.find({
            projectId: memo.projectId,
        })
            .populate("projectId", "code name description")
            .sort({ code: 1 });

        res.json({
            success: true,
            data: { memo, supplyOrder: supplyOrderData, budgetAllocations },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── GET /api/memos/:id/print/:form ──────────────────────────────────────────
const MEMO_PRINT_FORMS = [
    "form-6a", "form-6b", "form-6c", "form-7",
    "form-9", "form-10a", "form-10b", "form-1a",
    "decision-letter", "committee-letter",
    "form-12a", "form-12b", "182-12", "form-16b-182",
    "technical-opening-request", "form-19", "form-19b",
    "form-16b-2", "minutes-1", "minutes-2", "15-182",
];

export const printMemoForm = async (req, res, next) => {
    try {
        const { id, form } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        if (!MEMO_PRINT_FORMS.includes(form)) {
            return next(new AppError(`نموذج غير معروف: ${form}`, 400));
        }

        const memo = await Memo.findById(id)
            .populate("fiscalYear", "yearLabel")
            .populate({
                path: "projectId",
                populate: { path: "branchId", select: "code name" },
            })
            .populate("committeeTypeId", "name")
            .populate("financialWinnerId", "code name");

        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        // TODO: integrate with PDF generator to produce actual PDF binary
        res.json({
            success: true,
            data: { form, memoId: id, memo, generatedAt: new Date() },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};