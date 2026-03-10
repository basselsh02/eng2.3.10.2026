import FinancialDeduction from "../models/financialDeduction.model.js";
import Project from "../../project/models/project.model.js";

// Create Financial Deduction
export const createFinancialDeduction = async (req, res) => {
    try {
        const { projectId, ...deductionData } = req.body;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "المشروع غير موجود"
            });
        }

        // Generate unique deduction number if not provided
        if (!deductionData.deductionNumber) {
            const count = await FinancialDeduction.countDocuments();
            deductionData.deductionNumber = `DED-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        }

        const deduction = await FinancialDeduction.create({
            ...deductionData,
            project: projectId,
            projectCode: project.projectCode,
            createdBy: req.user._id,
            organizationalUnit: req.user.organizationalUnit || project.organizationalUnit
        });

        await deduction.populate('project');

        res.status(201).json({
            success: true,
            data: deduction,
            message: "تم إنشاء المخصم المالي بنجاح"
        });
    } catch (error) {
        console.error("Create Financial Deduction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء إنشاء المخصم المالي",
            error: error.message
        });
    }
};

// Get all Financial Deductions
export const getAllFinancialDeductions = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = "", 
            projectCode,
            status,
            deductionType,
            financialYear,
            contractorName
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { deductionNumber: { $regex: search, $options: "i" } },
                { projectCode: { $regex: search, $options: "i" } },
                { contractorName: { $regex: search, $options: "i" } },
                { contractNumber: { $regex: search, $options: "i" } },
                { deductionReason: { $regex: search, $options: "i" } }
            ];
        }

        if (projectCode) {
            query.projectCode = projectCode;
        }

        if (status) {
            query.status = status;
        }

        if (deductionType) {
            query.deductionType = deductionType;
        }

        if (financialYear) {
            query.financialYear = financialYear;
        }

        if (contractorName) {
            query.contractorName = { $regex: contractorName, $options: "i" };
        }

        if (!req.user.permissions?.financialDeduction?.includes('read:all')) {
            query.organizationalUnit = req.user.organizationalUnit;
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { deductionDate: -1, createdAt: -1 },
            populate: [
                { path: 'project', select: 'projectCode projectName projectType' },
                { path: 'createdBy', select: 'username fullNameArabic' },
                { path: 'organizationalUnit', select: 'name code' },
                { path: 'reviewedBy', select: 'username fullNameArabic' },
                { path: 'approvedBy', select: 'username fullNameArabic' }
            ]
        };

        const result = await FinancialDeduction.paginate(query, options);

        res.json({
            success: true,
            data: result.docs,
            pagination: {
                total: result.totalDocs,
                page: result.page,
                pages: result.totalPages,
                limit: result.limit,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });
    } catch (error) {
        console.error("Get Financial Deductions Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب المخصمات المالية",
            error: error.message
        });
    }
};

// Get Financial Deduction by ID
export const getFinancialDeductionById = async (req, res) => {
    try {
        const deduction = await FinancialDeduction.findById(req.params.id)
            .populate('project')
            .populate('createdBy', 'username fullNameArabic')
            .populate('updatedBy', 'username fullNameArabic')
            .populate('organizationalUnit', 'name code')
            .populate('reviewedBy', 'username fullNameArabic')
            .populate('approvedBy', 'username fullNameArabic');

        if (!deduction) {
            return res.status(404).json({
                success: false,
                message: "المخصم المالي غير موجود"
            });
        }

        res.json({
            success: true,
            data: deduction
        });
    } catch (error) {
        console.error("Get Financial Deduction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب المخصم المالي",
            error: error.message
        });
    }
};

// Get Deductions by Project
export const getDeductionsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const query = { project: projectId };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { deductionDate: -1 },
            populate: [
                { path: 'createdBy', select: 'username fullNameArabic' },
                { path: 'organizationalUnit', select: 'name code' }
            ]
        };

        const result = await FinancialDeduction.paginate(query, options);

        res.json({
            success: true,
            data: result.docs,
            pagination: {
                total: result.totalDocs,
                page: result.page,
                pages: result.totalPages
            }
        });
    } catch (error) {
        console.error("Get Project Deductions Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب مخصمات المشروع",
            error: error.message
        });
    }
};

// Update Financial Deduction
export const updateFinancialDeduction = async (req, res) => {
    try {
        const deduction = await FinancialDeduction.findById(req.params.id);

        if (!deduction) {
            return res.status(404).json({
                success: false,
                message: "المخصم المالي غير موجود"
            });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                deduction[key] = req.body[key];
            }
        });

        deduction.updatedBy = req.user._id;
        await deduction.save();
        await deduction.populate('project');

        res.json({
            success: true,
            data: deduction,
            message: "تم تحديث المخصم المالي بنجاح"
        });
    } catch (error) {
        console.error("Update Financial Deduction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث المخصم المالي",
            error: error.message
        });
    }
};

// Delete Financial Deduction
export const deleteFinancialDeduction = async (req, res) => {
    try {
        const deduction = await FinancialDeduction.findByIdAndDelete(req.params.id);

        if (!deduction) {
            return res.status(404).json({
                success: false,
                message: "المخصم المالي غير موجود"
            });
        }

        res.json({
            success: true,
            message: "تم حذف المخصم المالي بنجاح"
        });
    } catch (error) {
        console.error("Delete Financial Deduction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء حذف المخصم المالي",
            error: error.message
        });
    }
};

// Review Deduction
export const reviewDeduction = async (req, res) => {
    try {
        const { reviewNotes, approved } = req.body;
        
        const deduction = await FinancialDeduction.findByIdAndUpdate(
            req.params.id,
            {
                status: approved ? 'under_review' : 'pending',
                reviewedBy: req.user._id,
                reviewDate: new Date(),
                reviewNotes: reviewNotes || ''
            },
            { new: true }
        ).populate('project');

        if (!deduction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: deduction,
            message: "تم مراجعة المخصم بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Approve Deduction
export const approveDeduction = async (req, res) => {
    try {
        const { approvalNotes } = req.body;
        
        const deduction = await FinancialDeduction.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                approvedBy: req.user._id,
                approvalDate: new Date(),
                approvalNotes: approvalNotes || ''
            },
            { new: true }
        ).populate('project');

        if (!deduction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: deduction,
            message: "تم الموافقة على المخصم بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Reject Deduction
export const rejectDeduction = async (req, res) => {
    try {
        const { rejectionNotes } = req.body;
        
        const deduction = await FinancialDeduction.findByIdAndUpdate(
            req.params.id,
            {
                status: 'rejected',
                approvedBy: req.user._id,
                approvalDate: new Date(),
                approvalNotes: rejectionNotes || ''
            },
            { new: true }
        ).populate('project');

        if (!deduction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: deduction,
            message: "تم رفض المخصم"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mark as Paid
export const markAsPaid = async (req, res) => {
    try {
        const { paymentMethod, paymentReference } = req.body;
        
        const deduction = await FinancialDeduction.findByIdAndUpdate(
            req.params.id,
            {
                status: 'paid',
                paidDate: new Date(),
                paymentMethod: paymentMethod || '',
                paymentReference: paymentReference || ''
            },
            { new: true }
        ).populate('project');

        if (!deduction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: deduction,
            message: "تم تحديث حالة الدفع بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Deduction Statistics
export const getDeductionStatistics = async (req, res) => {
    try {
        const { projectId, financialYear } = req.query;
        
        const query = {};
        if (projectId) query.project = projectId;
        if (financialYear) query.financialYear = financialYear;
        if (!req.user.permissions?.financialDeduction?.includes('read:all')) {
            query.organizationalUnit = req.user.organizationalUnit;
        }

        const stats = await FinancialDeduction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalOriginalAmount: { $sum: '$originalAmount' },
                    totalDeductionAmount: { $sum: '$deductionAmount' },
                    totalNetAmount: { $sum: '$netAmount' }
                }
            }
        ]);

        const typeStats = await FinancialDeduction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$deductionType',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$deductionAmount' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                byStatus: stats,
                byType: typeStats
            }
        });
    } catch (error) {
        console.error("Get Deduction Statistics Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الإحصائيات",
            error: error.message
        });
    }
};
