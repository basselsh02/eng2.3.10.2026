import { AppError } from "../../../utils/AppError.js";
import publicationMemoModel from "../models/publicationMemo.model.js";
import mongoose from "mongoose";

export const createPublicationMemo = async (req, res, next) => {
    try {
        const publicationMemo = await publicationMemoModel.create(req.body);
        res.status(201).json({ success: true, data: publicationMemo });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const getAllPublicationMemos = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = "", projectNumber } = req.query;
        
        let query = {};
        
        // Filter by projectNumber if provided
        if (projectNumber) {
            query.projectNumber = projectNumber;
        }
        
        // Add search conditions
        if (search) {
            query.$or = [
                { projectNumber: { $regex: search, $options: 'i' } },
                { projectName: { $regex: search, $options: 'i' } },
                { branchName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        
        const publicationMemos = await publicationMemoModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await publicationMemoModel.countDocuments(query);

        res.json({ 
            success: true, 
            data: {
                publicationMemos,
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

export const getPublicationMemoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const publicationMemo = await publicationMemoModel.findById(id);
        if (!publicationMemo) {
            return next(new AppError("مذكرة النشر غير موجودة", 404));
        }
        res.json({ success: true, data: publicationMemo });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const updatePublicationMemo = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const publicationMemo = await publicationMemoModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!publicationMemo) {
            return next(new AppError("مذكرة النشر غير موجودة", 404));
        }
        res.json({ success: true, data: publicationMemo });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const deletePublicationMemo = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const publicationMemo = await publicationMemoModel.findByIdAndDelete(id);
        if (!publicationMemo) {
            return next(new AppError("مذكرة النشر غير موجودة", 404));
        }
        res.json({ success: true, message: "تم حذف مذكرة النشر بنجاح" });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
