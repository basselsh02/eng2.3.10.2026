// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import auditLoggerService from "../../../services/auditLogger.service.js";

export const login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(new AppError("اسم المستخدم وكلمة المرور مطلوبة", 400));
    }

    const user = await User.findOne({ username }).select('+password').populate({
        path: 'organizationalUnit',
        select: 'path name',
    });
    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError("اسم المستخدم او كلمة المرور غير صحيح", 401));
    }
    if (user.isDeleted) {
        return next(new AppError("حسابك محذوف", 401));
    }

    if (!process.env.JWT_SECRET) {
        return next(new AppError("JWT_SECRET is not configured", 500));
    }

    const token = jwt.sign(
        {
            id: user._id,
            organizationalUnit: user.organizationalUnit,
            permissions: user.permissions,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Log login event
    await auditLoggerService.logLogin(user, req);

    res.json({
        success: true,
        token,
        user: {
            ...user.toJSON(),
            // تأكد إن path موجود
        }
    });
});

// Super Admin only: assign permissions
export const assignPermissions = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new AppError("User not found", 404));

    user.permissions = req.body.permissions;
    await user.save();

    res.json({ success: true, data: user });
});

export const getUserByToken = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate("organizationalUnit");
    res.json({ success: true, data: user });
});

export const logout = catchAsync(async (req, res, next) => {
    // Log logout event
    await auditLoggerService.logLogout(req.user, req);
    
    res.json({
        success: true,
        message: "تم تسجيل الخروج بنجاح"
    });
});
