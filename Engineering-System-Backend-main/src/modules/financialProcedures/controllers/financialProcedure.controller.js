import FinancialProcedure from "../models/financialProcedure.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import { buildFilters } from "../../../utils/buildFilters.js";

// Create a new Financial Procedure
export const createFinancialProcedure = catchAsync(async (req, res, next) => {
    const newFinancialProcedure = await FinancialProcedure.create({
        ...req.body,
        createdBy: req.user._id,
        organizationalUnit: req.user.organizationalUnit
    });
    
    await newFinancialProcedure.populate("project", "projectName projectCode");
    
    res.status(201).json({
        success: true,
        data: newFinancialProcedure
    });
});

// Get all Financial Procedures with pagination
export const getAllFinancialProcedures = catchAsync(async (req, res, next) => {
    const { search, page, limit, projectId, procedureType } = req.query;
    
    const { filters, pagination } = buildFilters(search, page, limit, []);
    
    if (projectId) {
        filters.project = projectId;
    }
    
    if (procedureType) {
        filters.procedureType = procedureType;
    }
    
    const financialProcedures = await FinancialProcedure.find(filters)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate("project", "projectName projectCode financialYear")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    const total = await FinancialProcedure.countDocuments(filters);
    const totalPages = Math.ceil(total / pagination.limit);
    
    res.status(200).json({
        success: true,
        data: {
            financialProcedures,
            total,
            page: pagination.page,
            totalPages,
            limit: pagination.limit
        }
    });
});

// Get a single Financial Procedure by ID
export const getFinancialProcedureById = catchAsync(async (req, res, next) => {
    const financialProcedure = await FinancialProcedure.findById(req.params.id)
        .populate("project", "projectName projectCode financialYear estimatedCost")
        .populate("createdBy", "name email");
    
    if (!financialProcedure) {
        return next(new AppError("الإجراء المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: financialProcedure
    });
});

// Update a Financial Procedure by ID
export const updateFinancialProcedure = catchAsync(async (req, res, next) => {
    const updatedFinancialProcedure = await FinancialProcedure.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate("project", "projectName projectCode");
    
    if (!updatedFinancialProcedure) {
        return next(new AppError("الإجراء المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: updatedFinancialProcedure
    });
});

// Delete a Financial Procedure by ID
export const deleteFinancialProcedure = catchAsync(async (req, res, next) => {
    const financialProcedure = await FinancialProcedure.findByIdAndDelete(req.params.id);
    
    if (!financialProcedure) {
        return next(new AppError("الإجراء المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        message: "تم حذف الإجراء المالي بنجاح"
    });
});

// Get financial procedures by project ID
export const getFinancialProceduresByProject = catchAsync(async (req, res, next) => {
    const { projectId } = req.params;
    const { procedureType } = req.query;
    
    const query = { project: projectId };
    if (procedureType) {
        query.procedureType = procedureType;
    }
    
    const financialProcedures = await FinancialProcedure.find(query)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: financialProcedures
    });
});
