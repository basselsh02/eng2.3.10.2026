import FinancialStatus from "../models/financialStatus.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import { buildFilters } from "../../../utils/buildFilters.js";
import ExcelJS from "exceljs";

// Create a new Financial Status
export const createFinancialStatus = catchAsync(async (req, res, next) => {
    const newFinancialStatus = await FinancialStatus.create({
        ...req.body,
        createdBy: req.user._id,
        organizationalUnit: req.user.organizationalUnit
    });
    
    await newFinancialStatus.populate("project", "projectName projectCode");
    
    res.status(201).json({
        success: true,
        data: newFinancialStatus
    });
});

// Get all Financial Status records with pagination
export const getAllFinancialStatuses = catchAsync(async (req, res, next) => {
    const { search, page, limit, projectId, status, financialYear, filters } = req.query;
    
    const { filters: queryFilters, pagination } = buildFilters(search, page, limit, ["projectNumber", "projectType", "companyName", "projectDescription"]);

    if (filters) {
        const parsed = JSON.parse(filters);
        Object.keys(parsed || {}).forEach((key) => {
            if (parsed[key] !== undefined && parsed[key] !== null && parsed[key] !== "") {
                queryFilters[key] = { $regex: new RegExp(parsed[key], "i") };
            }
        });
    }
    
    if (projectId) {
        queryFilters.project = projectId;
    }
    
    if (status) {
        queryFilters.status = status;
    }
    
    if (financialYear) {
        queryFilters.financialYear = financialYear;
    }
    
    const financialStatuses = await FinancialStatus.find(queryFilters)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate("project", "projectName projectCode financialYear")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    const total = await FinancialStatus.countDocuments(queryFilters);
    const totalPages = Math.ceil(total / pagination.limit);
    
    res.status(200).json({
        success: true,
        data: {
            financialStatuses,
            total,
            page: pagination.page,
            totalPages,
            limit: pagination.limit
        }
    });
});

// Get a single Financial Status by ID
export const getFinancialStatusById = catchAsync(async (req, res, next) => {
    const financialStatus = await FinancialStatus.findById(req.params.id)
        .populate("project", "projectName projectCode financialYear estimatedCost")
        .populate("createdBy", "name email");
    
    if (!financialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: financialStatus
    });
});

// Update a Financial Status by ID
export const updateFinancialStatus = catchAsync(async (req, res, next) => {
    const updatedFinancialStatus = await FinancialStatus.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate("project", "projectName projectCode");
    
    if (!updatedFinancialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        data: updatedFinancialStatus
    });
});

// Delete a Financial Status by ID
export const deleteFinancialStatus = catchAsync(async (req, res, next) => {
    const financialStatus = await FinancialStatus.findByIdAndDelete(req.params.id);
    
    if (!financialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    res.status(200).json({
        success: true,
        message: "تم حذف الموقف المالي بنجاح"
    });
});

// Get financial statuses by project ID
export const getFinancialStatusesByProject = catchAsync(async (req, res, next) => {
    const { projectId } = req.params;
    
    const financialStatuses = await FinancialStatus.find({ project: projectId })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: financialStatuses
    });
});

// Add event to financial status
export const addEventToFinancialStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const eventData = req.body;
    
    const financialStatus = await FinancialStatus.findById(id);
    
    if (!financialStatus) {
        return next(new AppError("الموقف المالي غير موجود", 404));
    }
    
    financialStatus.events.push(eventData);
    await financialStatus.save();
    
    res.status(200).json({
        success: true,
        data: financialStatus
    });
});


export const exportToExcel = catchAsync(async (req, res, next) => {
    const search = req.body.search || "";
    const filters = req.body.filters ? JSON.parse(req.body.filters) : {};

    const query = {};
    if (search) {
        query.$or = [
            { projectNumber: { $regex: search, $options: "i" } },
            { projectType: { $regex: search, $options: "i" } },
            { companyName: { $regex: search, $options: "i" } },
            { projectDescription: { $regex: search, $options: "i" } },
        ];
    }
    Object.keys(filters).forEach((field) => {
        if (filters[field]) query[field] = { $regex: new RegExp(filters[field], "i") };
    });

    const docs = await FinancialStatus.find(query).sort({ createdAt: -1 }).lean();
    if (!docs.length) return next(new AppError("لا توجد بيانات للتصدير", 404));

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("البيانات");
    sheet.columns = [
        { header: "رقم المشروع", key: "projectNumber", width: 20 },
        { header: "اسم الشركة", key: "companyName", width: 24 },
        { header: "البوابة", key: "portal", width: 18 },
        { header: "الجهة المستفيدة", key: "beneficiaryEntity", width: 24 },
        { header: "الفرع", key: "branch", width: 18 },
        { header: "نوع المشروع", key: "projectType", width: 18 },
        { header: "العام المالي", key: "financialYear", width: 16 },
        { header: "وصف المشروع", key: "projectDescription", width: 32 },
    ];
    sheet.getRow(1).font = { bold: true };

    docs.forEach((doc) => sheet.addRow({
        projectNumber: doc.projectNumber || "",
        companyName: doc.companyName || "",
        portal: doc.portal || "",
        beneficiaryEntity: doc.beneficiaryEntity || "",
        branch: doc.branch || "",
        projectType: doc.projectType || "",
        financialYear: doc.financialYear || "",
        projectDescription: doc.projectDescription || "",
    }));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=financial_status_${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
});
