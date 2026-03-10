import { AppError } from "../../../utils/AppError.js";
import collectionModel from "../models/collection.model.js";
import mongoose from "mongoose";

export const createCollection = async (req, res, next) => {
    try {
        const collection = await collectionModel.create(req.body);
        res.status(201).json({ success: true, data: collection });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const getAllCollections = async (req, res, next) => {
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
        
        const collections = await collectionModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await collectionModel.countDocuments(query);

        res.json({ 
            success: true, 
            data: {
                collections,
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

export const getCollectionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const collection = await collectionModel.findById(id);
        if (!collection) {
            return next(new AppError("التحصيل غير موجود", 404));
        }
        res.json({ success: true, data: collection });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const updateCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const collection = await collectionModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!collection) {
            return next(new AppError("التحصيل غير موجود", 404));
        }
        res.json({ success: true, data: collection });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const deleteCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const collection = await collectionModel.findByIdAndDelete(id);
        if (!collection) {
            return next(new AppError("التحصيل غير موجود", 404));
        }
        res.json({ success: true, message: "تم حذف التحصيل بنجاح" });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
