import { AppError } from "../../../utils/AppError.js";
import projectModel from "../models/project.model.js";
import FinancialStatus from "../../financialStatus/models/financialStatus.model.js";
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

const resolveProjectByCode = async (projectCode) => {
    return projectModel.findOne({ projectCode });
};

export const getFinancialStatusByProjectCode = async (req, res, next) => {
    try {
        const { code } = req.params;
        const project = await resolveProjectByCode(code);

        if (!project) {
            return next(new AppError("المشروع غير موجود", 404));
        }

        const status = await FinancialStatus.findOne({ project: project._id })
            .sort({ createdAt: -1 })
            .populate("project", "projectCode projectName");

        res.json({
            success: true,
            data: status,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const upsertFinancialStatusByProjectCode = async (req, res, next) => {
    try {
        const { code } = req.params;
        const project = await resolveProjectByCode(code);

        if (!project) {
            return next(new AppError("المشروع غير موجود", 404));
        }

        const payload = {
            ...req.body,
            project: project._id,
            projectNumber: req.body.projectNumber ?? project.projectCode,
            projectType: req.body.projectType ?? project.projectType,
            financialYear: req.body.financialYear ?? project.financialYear,
        };

        const status = await FinancialStatus.findOneAndUpdate(
            { project: project._id },
            payload,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).populate("project", "projectCode projectName");

        res.status(201).json({ success: true, data: status });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const getFinancialStatusHistoryByProjectCode = async (req, res, next) => {
    try {
        const { code } = req.params;
        const project = await resolveProjectByCode(code);

        if (!project) {
            return next(new AppError("المشروع غير موجود", 404));
        }

        const status = await FinancialStatus.findOne({ project: project._id })
            .sort({ createdAt: -1 })
            .select("events updatedAt createdAt");

        res.json({
            success: true,
            data: status?.events || [],
            meta: {
                projectCode: code,
                lastUpdatedAt: status?.updatedAt || null,
            },
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
