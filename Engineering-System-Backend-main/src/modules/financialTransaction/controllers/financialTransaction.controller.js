import FinancialTransaction from "../models/financialTransaction.model.js";
import Project from "../../project/models/project.model.js";

// Create Financial Transaction
export const createFinancialTransaction = async (req, res) => {
    try {
        const { projectId, ...transactionData } = req.body;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "المشروع غير موجود"
            });
        }

        const transaction = await FinancialTransaction.create({
            ...transactionData,
            project: projectId,
            projectCode: project.projectCode,
            projectName: project.projectName,
            createdBy: req.user._id,
            organizationalUnit: req.user.organizationalUnit || project.organizationalUnit
        });

        await transaction.populate('project');

        res.status(201).json({
            success: true,
            data: transaction,
            message: "تم إنشاء الخردوة المالية بنجاح"
        });
    } catch (error) {
        console.error("Create Transaction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء إنشاء الخردوة المالية",
            error: error.message
        });
    }
};

// Get all Financial Transactions
export const getAllFinancialTransactions = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = "", 
            projectCode,
            status 
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { projectCode: { $regex: search, $options: "i" } },
                { projectName: { $regex: search, $options: "i" } },
                { branchName: { $regex: search, $options: "i" } }
            ];
        }

        if (projectCode) {
            query.projectCode = projectCode;
        }

        if (status) {
            query.status = status;
        }

        if (!req.user.permissions?.financialTransaction?.includes('read:all')) {
            query.organizationalUnit = req.user.organizationalUnit;
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                { path: 'project', select: 'projectCode projectName projectType' },
                { path: 'createdBy', select: 'username fullName' },
                { path: 'organizationalUnit', select: 'name code' }
            ]
        };

        const result = await FinancialTransaction.paginate(query, options);

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
        console.error("Get Transactions Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الخردوات المالية",
            error: error.message
        });
    }
};

// Get Financial Transaction by ID
export const getFinancialTransactionById = async (req, res) => {
    try {
        const transaction = await FinancialTransaction.findById(req.params.id)
            .populate('project')
            .populate('createdBy', 'username fullName')
            .populate('organizationalUnit', 'name code');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "الخردوة المالية غير موجودة"
            });
        }

        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error("Get Transaction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الخردوة المالية",
            error: error.message
        });
    }
};

// Get Transactions by Project
export const getTransactionsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const query = { project: projectId };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                { path: 'createdBy', select: 'username fullName' },
                { path: 'organizationalUnit', select: 'name code' }
            ]
        };

        const result = await FinancialTransaction.paginate(query, options);

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
        console.error("Get Project Transactions Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الخردوات المالية للمشروع",
            error: error.message
        });
    }
};

// Update Financial Transaction
export const updateFinancialTransaction = async (req, res) => {
    try {
        const transaction = await FinancialTransaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "الخردوة المالية غير موجودة"
            });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                transaction[key] = req.body[key];
            }
        });

        await transaction.save();
        await transaction.populate('project');

        res.json({
            success: true,
            data: transaction,
            message: "تم تحديث الخردوة المالية بنجاح"
        });
    } catch (error) {
        console.error("Update Transaction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث الخردوة المالية",
            error: error.message
        });
    }
};

// Delete Financial Transaction
export const deleteFinancialTransaction = async (req, res) => {
    try {
        const transaction = await FinancialTransaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "الخردوة المالية غير موجودة"
            });
        }

        res.json({
            success: true,
            message: "تم حذف الخردوة المالية بنجاح"
        });
    } catch (error) {
        console.error("Delete Transaction Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء حذف الخردوة المالية",
            error: error.message
        });
    }
};

// Update specific sections
export const updateCompanyOffersData = async (req, res) => {
    try {
        const transaction = await FinancialTransaction.findByIdAndUpdate(
            req.params.id,
            { 
                companyData: req.body.companyData,
                companyOffersList: req.body.companyOffersList 
            },
            { new: true }
        );
        
        if (!transaction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateTechnicalData = async (req, res) => {
    try {
        const transaction = await FinancialTransaction.findByIdAndUpdate(
            req.params.id,
            { technicalProcedures: req.body },
            { new: true }
        );
        
        if (!transaction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateFinancialOpeningData = async (req, res) => {
    try {
        const transaction = await FinancialTransaction.findByIdAndUpdate(
            req.params.id,
            { financialOpening: req.body },
            { new: true }
        );
        
        if (!transaction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateFinancialItems = async (req, res) => {
    try {
        const transaction = await FinancialTransaction.findByIdAndUpdate(
            req.params.id,
            { financialItems: req.body.items },
            { new: true }
        );
        
        if (!transaction) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
