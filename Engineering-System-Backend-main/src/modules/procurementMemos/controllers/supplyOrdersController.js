import mongoose from "mongoose";
import SupplyOrder from "../models/SupplyOrder.js";
import SupplyOrderItem from "../models/SupplyOrderItem.js";
import Memo from "../models/Memo.js";
import { AppError } from "../../../utils/AppError.js";

// ─── Helper ───────────────────────────────────────────────────────────────────
const computeSupplyOrderFields = async (supplyOrder) => {
    const items = await SupplyOrderItem.find({ orderId: supplyOrder._id })
        .populate("unitId", "name symbol")
        .sort({ itemNumber: 1 });

    const computedItems = items.map((item) => ({
        ...item.toObject(),
        total: Math.round((item.quantity || 0) * (item.unitPrice || 0) * 100) / 100,
    }));

    const totalValue = computedItems.reduce((sum, i) => sum + (i.total || 0), 0);
    const valueAfterDiscount =
        totalValue - (totalValue * (supplyOrder.discountPercentage || 0)) / 100;
    const guaranteeValue =
        (valueAfterDiscount * (supplyOrder.guaranteePercentage || 0)) / 100;

    return {
        ...supplyOrder.toObject(),
        items: computedItems,
        totalValue: Math.round(totalValue * 100) / 100,
        valueAfterDiscount: Math.round(valueAfterDiscount * 100) / 100,
        guaranteeValue: Math.round(guaranteeValue * 100) / 100,
    };
};

// ─── GET /api/supply-orders/:id ───────────────────────────────────────────────
export const getSupplyOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        const supplyOrder = await SupplyOrder.findById(id)
            .populate("companyId", "code name")
            .populate("memoId", "refNumber documentType")
            .populate("categoryGroupId", "name symbol");

        if (!supplyOrder) {
            return next(new AppError("أمر التوريد غير موجود", 404));
        }

        const data = await computeSupplyOrderFields(supplyOrder);
        res.json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ─── POST /api/supply-orders ─────────────────────────────────────────────────
export const createSupplyOrder = async (req, res, next) => {
    try {
        const {
            memoId,
            companyId,
            orderNumber,
            orderDate,
            subject,
            discountPercentage,
            guaranteePercentage,
            categoryGroupId,
            notes,
            items,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(memoId)) {
            return next(new AppError("memoId غير صحيح", 400));
        }

        const memo = await Memo.findById(memoId);
        if (!memo) {
            return next(new AppError("المذكرة غير موجودة", 404));
        }

        const resolvedOrderNumber = orderNumber || (await generateOrderNumber());

        const supplyOrder = await SupplyOrder.create({
            memoId,
            companyId,
            orderNumber: resolvedOrderNumber,
            orderDate,
            subject,
            discountPercentage: discountPercentage || 0,
            guaranteePercentage: guaranteePercentage || 0,
            categoryGroupId,
            notes,
        });

        if (Array.isArray(items) && items.length > 0) {
            await SupplyOrderItem.insertMany(
                items.map((item) => ({ ...item, orderId: supplyOrder._id }))
            );
        }

        const populated = await SupplyOrder.findById(supplyOrder._id)
            .populate("companyId", "code name")
            .populate("memoId", "refNumber documentType")
            .populate("categoryGroupId", "name symbol");

        const data = await computeSupplyOrderFields(populated);
        res.status(201).json({ success: true, data });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};

const generateOrderNumber = async () => {
    const count = await SupplyOrder.countDocuments();
    const year = new Date().getFullYear().toString().slice(-2);
    return `${count + 1}/${year}`;
};

// ─── Print forms for supply orders ───────────────────────────────────────────
const SUPPLY_ORDER_PRINT_FORMS = [
    "print",
    "form-19-1b",
    "form-1b-1",
    "treasury-report",
    "size-report",
    "deductions-minutes",
];

export const printSupplyOrderForm = async (req, res, next) => {
    try {
        const { id, form } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }

        if (!SUPPLY_ORDER_PRINT_FORMS.includes(form)) {
            return next(new AppError(`نموذج غير معروف: ${form}`, 400));
        }

        const supplyOrder = await SupplyOrder.findById(id)
            .populate("companyId", "code name")
            .populate("memoId", "refNumber documentType")
            .populate("categoryGroupId", "name symbol");

        if (!supplyOrder) {
            return next(new AppError("أمر التوريد غير موجود", 404));
        }

        const data = await computeSupplyOrderFields(supplyOrder);

        // TODO: integrate with PDF generator to produce actual PDF binary
        res.json({
            success: true,
            data: { form, supplyOrderId: id, supplyOrder: data, generatedAt: new Date() },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};