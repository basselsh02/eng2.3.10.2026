import BillOfQuantities from "../models/billOfQuantities.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import { buildFilters } from "../../../utils/buildFilters.js";

// Create a new Bill of Quantities
export const createBillOfQuantities = catchAsync(async (req, res, next) => {
    const newBillOfQuantities = await BillOfQuantities.create({ ...req.body, createdBy: req.user._id, organizationalUnit: req.user.organizationalUnit });
    res.status(201).json({
        status: "success",
        data: {
            billOfQuantities: newBillOfQuantities,
        },
    });
});

// Get all Bill of Quantities
export const getAllBillOfQuantities = catchAsync(async (req, res, next) => {
    const { search, page, limit } = req.query;
    const { filters, pagination } = buildFilters(search, page, limit, ['itemNumber', 'description']);

    const billOfQuantities = await BillOfQuantities.find(filters)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate("project", "projectName")
        .sort({ createdAt: -1 });

    const total = await BillOfQuantities.countDocuments(filters);

    res.status(200).json({
        status: "success",
        data: {
            billOfQuantities,
            total,
            page: pagination.page,
            limit: pagination.limit,
        },
    });
});

// Get a single Bill of Quantities by ID
export const getBillOfQuantitiesById = catchAsync(async (req, res, next) => {
    const billOfQuantities = await BillOfQuantities.findById(req.params.id);
    if (!billOfQuantities) {
        return next(new AppError("No Bill of Quantities found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            billOfQuantities,
        },
    });
});

// Update a Bill of Quantities by ID
export const updateBillOfQuantities = catchAsync(async (req, res, next) => {
    const updatedBillOfQuantities = await BillOfQuantities.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!updatedBillOfQuantities) {
        return next(new AppError("No Bill of Quantities found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            billOfQuantities: updatedBillOfQuantities,
        },
    });
});

// Delete a Bill of Quantities by ID
export const deleteBillOfQuantities = catchAsync(async (req, res, next) => {
    const billOfQuantities = await BillOfQuantities.findByIdAndDelete(req.params.id);
    if (!billOfQuantities) {
        return next(new AppError("No Bill of Quantities found with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});
