import Procedure from "../models/procedure.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import { buildFilters } from "../../../utils/buildFilters.js";
import projectModel from "../../project/models/project.model.js";

// Create a new Procedure
export const createProcedure = catchAsync(async (req, res, next) => {
    const newProcedure = await Procedure.create({
        ...req.body,
        createdBy: req.user._id,
        organizationalUnit: req.user.organizationalUnit
    });
    
    await newProcedure.populate("project", "projectName projectCode");
    
    res.status(201).json({
        success: true,
        data: newProcedure
    });
});

// Get all Procedures with pagination and search
export const getAllProcedures = catchAsync(async (req, res, next) => {
    const { search, page, limit, projectId, procedureType } = req.query;
    
    const { filters, pagination } = buildFilters(search, page, limit, []);
    
    // Add project filter if provided
    if (projectId) {
        filters.project = projectId;
    }
    
    // Add procedure type filter if provided
    if (procedureType) {
        filters.procedureType = procedureType;
    }
    
    const procedures = await Procedure.find(filters)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate("project", "projectName projectCode financialYear")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    const total = await Procedure.countDocuments(filters);
    const totalPages = Math.ceil(total / pagination.limit);
    
    res.status(200).json({
        success: true,
        data: {
            procedures,
            total,
            page: pagination.page,
            totalPages,
            limit: pagination.limit
        }
    });
});

// Get a single Procedure by ID
export const getProcedureById = catchAsync(async (req, res, next) => {
    const procedure = await Procedure.findById(req.params.id)
        .populate("project", "projectName projectCode financialYear estimatedCost")
        .populate("createdBy", "name email");
    
    if (!procedure) {
        return next(new AppError("الإجراء غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: procedure
    });
});

// Update a Procedure by ID
export const updateProcedure = catchAsync(async (req, res, next) => {
    const updatedProcedure = await Procedure.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate("project", "projectName projectCode");
    
    if (!updatedProcedure) {
        return next(new AppError("الإجراء غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: updatedProcedure
    });
});

// Delete a Procedure by ID
export const deleteProcedure = catchAsync(async (req, res, next) => {
    const procedure = await Procedure.findByIdAndDelete(req.params.id);
    
    if (!procedure) {
        return next(new AppError("الإجراء غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        message: "تم حذف الإجراء بنجاح"
    });
});

// Get procedures by project ID
export const getProceduresByProject = catchAsync(async (req, res, next) => {
    const { projectId } = req.params;
    const { procedureType } = req.query;
    
    const query = { project: projectId };
    if (procedureType) {
        query.procedureType = procedureType;
    }
    
    const procedures = await Procedure.find(query)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: procedures
    });
});


// Get company offers on procedures page by project code
export const getProcedureCompanyOffersByProjectCode = catchAsync(async (req, res, next) => {
    const { code } = req.params;

    const project = await projectModel.findOne({ projectCode: code }).select("_id projectCode projectName financialYear");
    if (!project) {
        return next(new AppError("المشروع غير موجود", 404));
    }

    const offers = await Procedure.find({
        project: project._id,
        procedureType: "company_offers"
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { project, offers }
    });
});

// Update company offers by offer/procedure id
export const updateProcedureCompanyOffer = catchAsync(async (req, res, next) => {
    const { code, offerId } = req.params;

    const project = await projectModel.findOne({ projectCode: code }).select("_id");
    if (!project) {
        return next(new AppError("المشروع غير موجود", 404));
    }

    const updated = await Procedure.findOneAndUpdate(
        { _id: offerId, project: project._id, procedureType: "company_offers" },
        req.body,
        { new: true, runValidators: true }
    ).populate("project", "projectName projectCode financialYear");

    if (!updated) {
        return next(new AppError("العرض غير موجود", 404));
    }

    res.status(200).json({
        success: true,
        data: updated
    });
});
