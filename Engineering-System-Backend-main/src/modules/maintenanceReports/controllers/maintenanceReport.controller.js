import mongoose from "mongoose";
import { AppError } from "../../../utils/AppError.js";
import MaintenanceReport from "../models/maintenanceReport.model.js";
import ExcelJS from "exceljs";

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


export const exportToExcel = async (req, res, next) => {
  try {
    const search = req.body.search || "";
    const filters = req.body.filters ? JSON.parse(req.body.filters) : {};
    const query = {};

    if (search) {
      query.$or = [
        { projectNumber: { $regex: search, $options: "i" } },
        { projectName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    Object.keys(filters).forEach((field) => {
      if (filters[field]) query[field] = { $regex: new RegExp(filters[field], "i") };
    });

    const docs = await MaintenanceReport.find(query).sort({ createdAt: -1 }).lean();
    if (!docs.length) return next(new AppError("لا توجد بيانات للتصدير", 404));

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("البيانات");
    sheet.columns = [
      { header: "رقم المشروع", key: "projectNumber", width: 20 },
      { header: "الشركة", key: "company", width: 24 },
      { header: "بيان المشروع", key: "projectName", width: 28 },
      { header: "المبلغ المنصرف", key: "disbursedAmount", width: 18 },
      { header: "من", key: "fromDate", width: 14 },
      { header: "إلى", key: "toDate", width: 14 },
    ];
    sheet.getRow(1).font = { bold: true };

    docs.forEach((doc) => sheet.addRow({
      projectNumber: doc.projectNumber || "",
      company: doc.company || "",
      projectName: doc.projectName || "",
      disbursedAmount: doc.disbursedAmount || "",
      fromDate: doc.fromDate ? new Date(doc.fromDate).toLocaleDateString("ar-EG") : "",
      toDate: doc.toDate ? new Date(doc.toDate).toLocaleDateString("ar-EG") : "",
    }));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=maintenance_reports_${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
