import { AppError } from "../../../utils/AppError.js";
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async (req, res, next) => {
    try {
        const project = await projectModel.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError("كود المشروع مكرر", 400));
        }
        return next(new AppError(error.message, 500));
    }
};

export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await projectModel.find().sort({ createdAt: -1 });
        res.json({ success: true, data: projects });
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
        const project = await projectModel.findById(id);
        if (!project) {
            return next(new AppError("المشروع غير موجود", 404));
        }
        res.json({ success: true, data: project });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const project = await projectModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!project) {
            return next(new AppError("المشروع غير موجود", 404));
        }
        res.json({ success: true, data: project });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const project = await projectModel.findByIdAndDelete(id);
        if (!project) {
            return next(new AppError("المشروع غير موجود", 404));
        }
        res.json({ success: true, message: "تم حذف المشروع بنجاح" });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
