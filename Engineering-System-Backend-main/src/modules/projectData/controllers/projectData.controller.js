import { AppError } from "../../../utils/AppError.js";
import projectDataModel from "../models/projectData.model.js";
import mongoose from "mongoose";

// ── existing functions (unchanged) ───────────────────────────

// Create Project Data
export const createProjectData = async (req, res, next) => {
    try {
        const projectData = await projectDataModel.create(req.body);
        res.status(201).json({ success: true, data: projectData });
    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError("كود المشروع مكرر", 400));
        }
        return next(new AppError(error.message, 500));
    }
};

// Get All Project Data
export const getAllProjectData = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        
        const query = search 
            ? {
                $or: [
                    { projectCode: { $regex: search, $options: 'i' } },
                    { projectName: { $regex: search, $options: 'i' } },
                    { financialYear: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const skip = (page - 1) * limit;
        
        const projectData = await projectDataModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await projectDataModel.countDocuments(query);

        res.json({ 
            success: true, 
            data: {
                projectData,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Get Project Data By ID
export const getProjectDataById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const projectData = await projectDataModel.findById(id);
        if (!projectData) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }
        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Update Project Data
export const updateProjectData = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const projectData = await projectDataModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!projectData) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }
        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Delete Project Data
export const deleteProjectData = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const projectData = await projectDataModel.findByIdAndDelete(id);
        if (!projectData) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }
        res.json({ success: true, message: "تم الحذف بنجاح" });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Add Work Item
export const addWorkItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const projectData = await projectDataModel.findByIdAndUpdate(
            id,
            { $push: { workItems: req.body } },
            { new: true }
        );
        if (!projectData) return next(new AppError("بيانات المشروع غير موجودة", 404));
        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Add Candidate Company
export const addCandidateCompany = async (req, res, next) => {
    try {
        const { id } = req.params;
        const projectData = await projectDataModel.findByIdAndUpdate(
            id,
            { $push: { candidateCompanies: req.body } },
            { new: true }
        );
        if (!projectData) return next(new AppError("بيانات المشروع غير موجودة", 404));
        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Add Project Condition
export const addProjectCondition = async (req, res, next) => {
    try {
        const { id } = req.params;
        const projectData = await projectDataModel.findByIdAndUpdate(
            id,
            { $push: { projectConditions: req.body } },
            { new: true }
        );
        if (!projectData) return next(new AppError("بيانات المشروع غير موجودة", 404));
        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// ── NEW: Get by projectCode + optional financialYear ─────────
/**
 * GET /api/project-data/by-code?projectCode=XXX&financialYear=2026/2025
 * Used by the /publishing-office/projects-details page.
 */
export const getProjectDataByCode = async (req, res, next) => {
    try {
        const { projectCode, financialYear } = req.query;

        if (!projectCode) {
            return next(new AppError("كود المشروع مطلوب", 400));
        }

        const filter = { projectCode: { $regex: `^${projectCode}$`, $options: 'i' } };
        if (financialYear) {
            filter.financialYear = { $regex: `^${financialYear}$`, $options: 'i' };
        }

        const projectData = await projectDataModel.findOne(filter);

        if (!projectData) {
            return next(new AppError("لم يتم العثور على بيانات المشروع", 404));
        }

        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
