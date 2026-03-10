import FinancialStatus from "../models/financialStatus.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import { buildFilters } from "../../../utils/buildFilters.js";

// Create a new Financial Status
export const createFinancialStatus = catchAsync(async (req, res, next) => {
    const newFinancialStatus = await FinancialStatus.create({
        ...req.body,
        createdBy: req.user._id,
        organizationalUnit: req.user.organizationalUnit
    });
    
    await newFinancialStatus.populate("project", "projectName projectCode");
    
    res.status(201).json({
        success: true,
        data: newFinancialStatus
    });
});

// Get all Financial Status records with pagination
export const getAllFinancialStatuses = catchAsync(async (req, res, next) => {
    const { search, page, limit, projectId, status, financialYear } = req.query;
    
    const { filters, pagination } = buildFilters(search, page, limit, ["projectNumber", "projectType"]);
    
    if (projectId) {
        filters.project = projectId;
    }
    
    if (status) {
        filters.status = status;
    }
    
    if (financialYear) {
        filters.financialYear = financialYear;
    }
    
    const financialStatuses = await FinancialStatus.find(filters)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate("project", "projectName projectCode financialYear")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    const total = await FinancialStatus.countDocuments(filters);
    const totalPages = Math.ceil(total / pagination.limit);
    
    res.status(200).json({
        success: true,
        data: {
            financialStatuses,
            total,
            page: pagination.page,
            totalPages,
            limit: pagination.limit
        }
    });
});

// Get a single Financial Status by ID
export const getFinancialStatusById = catchAsync(async (req, res, next) => {
    const financialStatus = await FinancialStatus.findById(req.params.id)
        .populate("project", "projectName projectCode financialYear estimatedCost")
        .populate("createdBy", "name email");
    
    if (!financialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: financialStatus
    });
});

// Update a Financial Status by ID
export const updateFinancialStatus = catchAsync(async (req, res, next) => {
    const updatedFinancialStatus = await FinancialStatus.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate("project", "projectName projectCode");
    
    if (!updatedFinancialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: updatedFinancialStatus
    });
});

// Delete a Financial Status by ID
export const deleteFinancialStatus = catchAsync(async (req, res, next) => {
    const financialStatus = await FinancialStatus.findByIdAndDelete(req.params.id);
    
    if (!financialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        message: "تم حذف الموقف المالي بنجاح"
    });
});

// Get financial statuses by project ID
export const getFinancialStatusesByProject = catchAsync(async (req, res, next) => {
    const { projectId } = req.params;
    
    const financialStatuses = await FinancialStatus.find({ project: projectId })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: financialStatuses
    });
});

// Add event to financial status
export const addEventToFinancialStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const eventData = req.body;
    
    const financialStatus = await FinancialStatus.findById(id);
    
    if (!financialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    financialStatus.events.push(eventData);
    await financialStatus.save();
    
    res.status(200).json({
        success: true,
        data: financialStatus
    });
});
