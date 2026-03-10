import { AppError } from "../../../utils/AppError.js";
import projectPublicationModel from "../models/projectPublication.model.js";
import mongoose from "mongoose";

export const createProjectPublication = async (req, res, next) => {
    try {
        const projectPublication = await projectPublicationModel.create(req.body);
        res.status(201).json({ success: true, data: projectPublication });
    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError("كود المشروع مكرر", 400));
        }
        return next(new AppError(error.message, 500));
    }
};

export const getAllProjectPublications = async (req, res, next) => {
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
        
        const projectPublications = await projectPublicationModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await projectPublicationModel.countDocuments(query);

        res.json({ 
            success: true, 
            data: {
                projectPublications,
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

export const getProjectPublicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const projectPublication = await projectPublicationModel.findById(id);
        if (!projectPublication) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }
        res.json({ success: true, data: projectPublication });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const updateProjectPublication = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const projectPublication = await projectPublicationModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!projectPublication) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }
        res.json({ success: true, data: projectPublication });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const deleteProjectPublication = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const projectPublication = await projectPublicationModel.findByIdAndDelete(id);
        if (!projectPublication) {
            return next(new AppError("بيانات المشروع غير موجودة", 404));
        }
        res.json({ success: true, message: "تم حذف بيانات المشروع بنجاح" });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
