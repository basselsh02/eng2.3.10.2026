import { AppError } from "../../../utils/AppError.js";
import projectDataModel from "../models/projectData.model.js";
import mongoose from "mongoose";

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
        const projectData = await projectDataModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
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
        res.json({ success: true, message: "تم حذف بيانات المشروع بنجاح" });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Add Work Item
export const addWorkItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        
        const projectData = await projectDataModel.findById(id);
        if (!projectData) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }

        projectData.workItems.push(req.body);
        await projectData.save();

        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Add Candidate Company
export const addCandidateCompany = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        
        const projectData = await projectDataModel.findById(id);
        if (!projectData) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }

        projectData.candidateCompanies.push(req.body);
        await projectData.save();

        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Add Project Condition
export const addProjectCondition = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        
        const projectData = await projectDataModel.findById(id);
        if (!projectData) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }

        projectData.projectConditions.push(req.body);
        await projectData.save();

        res.json({ success: true, data: projectData });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
