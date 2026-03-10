import Office from "../models/office.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import { buildFilters } from "../../../utils/buildFilters.js";
import mongoose from "mongoose";

// Create a new office
export const createOffice = catchAsync(async (req, res, next) => {
    const { name, code, type, description, managerId, organizationalUnit } = req.body;

    // Validate required fields
    if (!name || !code) {
        return next(new AppError("اسم المكتب والرمز مطلوبان", 400));
    }

    // Check if office with same code already exists
    const existingOffice = await Office.findOne({ code: code.toUpperCase() });
    if (existingOffice) {
        return next(new AppError("رمز المكتب/الكتيبة موجود بالفعل", 400));
    }

    // Validate managerId if provided
    if (managerId && !mongoose.Types.ObjectId.isValid(managerId)) {
        return next(new AppError("معرف المدير غير صحيح", 400));
    }

    const newOffice = await Office.create({
        name,
        code: code.toUpperCase(),
        type: type || "مكتب",
        description: description || null,
        managerId: managerId || null,
        organizationalUnit: organizationalUnit || null,
        createdBy: req.user._id
    });

    await newOffice.populate("managerId", "fullNameArabic fullNameEnglish");
    await newOffice.populate("createdBy", "fullNameArabic");

    res.status(201).json({
        success: true,
        message: "تم إنشاء المكتب/الكتيبة بنجاح",
        data: newOffice
    });
});

// Get all offices with pagination and search
export const getAllOffices = catchAsync(async (req, res, next) => {
    const { search, page = 1, limit = 10, type, isActive } = req.query;

    const filters = {};

    // Add type filter if provided
    if (type && ["مكتب", "كتيبة"].includes(type)) {
        filters.type = type;
    }

    // Add active filter if provided
    if (isActive !== undefined) {
        filters.isActive = isActive === "true";
    }

    // Add search filter
    if (search) {
        const searchRegex = new RegExp(search, "i");
        filters.$or = [
            { name: searchRegex },
            { code: searchRegex },
            { description: searchRegex }
        ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const offices = await Office.find(filters)
        .populate("managerId", "fullNameArabic fullNameEnglish phones")
        .populate("createdBy", "fullNameArabic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Office.countDocuments(filters);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
        success: true,
        data: {
            offices,
            total,
            page: pageNum,
            totalPages,
            limit: limitNum
        }
    });
});

// Get office by ID
export const getOfficeById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف المكتب غير صحيح", 400));
    }

    const office = await Office.findById(id)
        .populate("managerId", "fullNameArabic fullNameEnglish phones email")
        .populate("createdBy", "fullNameArabic");

    if (!office) {
        return next(new AppError("المكتب/الكتيبة غير موجود", 404));
    }

    res.status(200).json({
        success: true,
        data: office
    });
});

// Update office
export const updateOffice = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, code, type, description, managerId, organizationalUnit, isActive, permissions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف المكتب غير صحيح", 400));
    }

    const office = await Office.findById(id);
    if (!office) {
        return next(new AppError("المكتب/الكتيبة غير موجود", 404));
    }

    // Check if code is being changed and if new code already exists
    if (code && code.toUpperCase() !== office.code) {
        const existingOffice = await Office.findOne({ code: code.toUpperCase() });
        if (existingOffice) {
            return next(new AppError("رمز المكتب/الكتيبة موجود بالفعل", 400));
        }
        office.code = code.toUpperCase();
    }

    // Validate managerId if provided
    if (managerId && !mongoose.Types.ObjectId.isValid(managerId)) {
        return next(new AppError("معرف المدير غير صحيح", 400));
    }

    // Update fields
    if (name) office.name = name;
    if (type && ["مكتب", "كتيبة"].includes(type)) office.type = type;
    if (description !== undefined) office.description = description || null;
    if (managerId !== undefined) office.managerId = managerId || null;
    if (organizationalUnit !== undefined) office.organizationalUnit = organizationalUnit || null;
    if (isActive !== undefined) office.isActive = isActive;

    // Only privileged users can update permissions
    if (permissions !== undefined) {
        const privilegedRoles = ["SUPER_ADMIN", "مدير", "رئيس فرة", "مدير الادارة"];
        if (!privilegedRoles.includes(req.user.role)) {
            return next(new AppError("ليس لديك صلاحية لتعديل صلاحيات المكتب", 403));
        }

        if (!Array.isArray(permissions)) {
            return next(new AppError("حقل permissions يجب أن يكون مصفوفة", 400));
        }

        // Validate permission structure
        const validPermissions = permissions.map(perm => {
            if (typeof perm !== "object" || !perm.action) {
                throw new AppError("صيغة صلاحية غير صالحة", 400);
            }
            return {
                action: perm.action,
                scope: perm.scope || "ALL",
                units: perm.scope === "CUSTOM_UNITS" ? (perm.units || []) : []
            };
        });

        office.permissions = validPermissions;
    }

    await office.save();

    await office.populate("managerId", "fullNameArabic fullNameEnglish");
    await office.populate("createdBy", "fullNameArabic");

    res.status(200).json({
        success: true,
        message: "تم تحديث المكتب/الكتيبة بنجاح",
        data: office
    });
});

// Delete office
export const deleteOffice = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف المكتب غير صحيح", 400));
    }

    const office = await Office.findByIdAndDelete(id);

    if (!office) {
        return next(new AppError("المكتب/الكتيبة غير موجود", 404));
    }

    res.status(200).json({
        success: true,
        message: "تم حذف المكتب/الكتيبة بنجاح"
    });
});

// Get dropdown list (id and name pairs)
export const getOfficesDropdown = catchAsync(async (req, res, next) => {
    const { type } = req.query;

    const filters = { isActive: true };

    if (type && ["مكتب", "كتيبة"].includes(type)) {
        filters.type = type;
    }

    const offices = await Office.find(filters)
        .select("_id name code type")
        .sort({ name: 1 });

    res.status(200).json({
        success: true,
        data: offices
    });
});

// Get offices count by type
export const getOfficesStats = catchAsync(async (req, res, next) => {
    const stats = await Office.aggregate([
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                active: {
                    $sum: { $cond: ["$isActive", 1, 0] }
                }
            }
        }
    ]);

    const total = await Office.countDocuments();
    const active = await Office.countDocuments({ isActive: true });

    res.status(200).json({
        success: true,
        data: {
            total,
            active,
            byType: stats
        }
    });
});
