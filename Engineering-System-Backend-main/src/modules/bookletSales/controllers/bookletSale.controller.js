import { AppError } from "../../../utils/AppError.js";
import bookletSaleModel from "../models/bookletSale.model.js";
import mongoose from "mongoose";

export const createBookletSale = async (req, res, next) => {
    try {
        const bookletSale = await bookletSaleModel.create(req.body);
        res.status(201).json({ success: true, data: bookletSale });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const getAllBookletSales = async (req, res, next) => {
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
        
        const bookletSales = await bookletSaleModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await bookletSaleModel.countDocuments(query);

        res.json({ 
            success: true, 
            data: {
                bookletSales,
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

export const getBookletSaleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const bookletSale = await bookletSaleModel.findById(id);
        if (!bookletSale) {
            return next(new AppError("بيع الكراسة غير موجود", 404));
        }
        res.json({ success: true, data: bookletSale });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const updateBookletSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const bookletSale = await bookletSaleModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!bookletSale) {
            return next(new AppError("بيع الكراسة غير موجود", 404));
        }
        res.json({ success: true, data: bookletSale });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const deleteBookletSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("ID غير صحيح", 400));
        }
        const bookletSale = await bookletSaleModel.findByIdAndDelete(id);
        if (!bookletSale) {
            return next(new AppError("بيع الكراسة غير موجود", 404));
        }
        res.json({ success: true, message: "تم حذف بيع الكراسة بنجاح" });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
