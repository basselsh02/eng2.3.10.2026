import mongoose from "mongoose";
import { AppError } from "../../../utils/AppError.js";
import MaintenanceReport from "../models/maintenanceReport.model.js";

const validateBusinessRules = (payload) => {
  if (payload.fromDate && payload.toDate && new Date(payload.toDate) < new Date(payload.fromDate)) {
    throw new AppError("تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية", 400);
  }

  if (payload.isStopped && !payload.stoppedNote?.trim()) {
    throw new AppError("سبب الإيقاف مطلوب عند تفعيل حالة متوقف", 400);
  }
};

export const createMaintenanceReport = async (req, res, next) => {
  try {
    validateBusinessRules(req.body);
    const report = await MaintenanceReport.create(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    return next(new AppError(error.message, error.statusCode || 500));
  }
};

export const getAllMaintenanceReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", projectNumber = "" } = req.query;

    const query = {};

    if (projectNumber) {
      query.projectNumber = projectNumber;
    }

    if (search) {
      query.$or = [
        { projectNumber: { $regex: search, $options: "i" } },
        { projectName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (currentPage - 1) * pageSize;

    const docs = await MaintenanceReport.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const total = await MaintenanceReport.countDocuments(query);

    res.json({
      success: true,
      data: {
        docs,
        totalPages: Math.ceil(total / pageSize) || 1,
        totalItems: total,
        currentPage,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getMaintenanceReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("ID غير صحيح", 400));
    }

    const report = await MaintenanceReport.findById(id);
    if (!report) {
      return next(new AppError("تقرير الصيانة غير موجود", 404));
    }

    res.json({ success: true, data: report });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const updateMaintenanceReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("ID غير صحيح", 400));
    }

    validateBusinessRules(req.body);

    const report = await MaintenanceReport.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!report) {
      return next(new AppError("تقرير الصيانة غير موجود", 404));
    }

    res.json({ success: true, data: report });
  } catch (error) {
    return next(new AppError(error.message, error.statusCode || 500));
  }
};

export const deleteMaintenanceReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("ID غير صحيح", 400));
    }

    const report = await MaintenanceReport.findByIdAndDelete(id);
    if (!report) {
      return next(new AppError("تقرير الصيانة غير موجود", 404));
    }

    res.json({ success: true, message: "تم حذف تقرير الصيانة بنجاح" });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
