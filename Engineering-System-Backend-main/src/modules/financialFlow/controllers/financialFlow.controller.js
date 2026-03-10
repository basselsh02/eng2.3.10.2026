import FinancialFlow from "../models/financialFlow.model.js";
import Project from "../../project/models/project.model.js";

// Create Financial Flow
export const createFinancialFlow = async (req, res) => {
    try {
        const { projectId, ...flowData } = req.body;
        
        // Verify project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "المشروع غير موجود"
            });
        }

        const financialFlow = await FinancialFlow.create({
            ...flowData,
            project: projectId,
            projectCode: project.projectCode,
            projectName: project.projectName,
            createdBy: req.user._id,
            organizationalUnit: req.user.organizationalUnit || project.organizationalUnit
        });

        await financialFlow.populate('project');

        res.status(201).json({
            success: true,
            data: financialFlow,
            message: "تم إنشاء الخردوة المالية بنجاح"
        });
    } catch (error) {
        console.error("Create Financial Flow Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء إنشاء الخردوة المالية",
            error: error.message
        });
    }
};

// Get all Financial Flows with pagination
export const getAllFinancialFlows = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = "", 
            projectCode,
            status 
        } = req.query;

        const query = {};

        // Search filter
        if (search) {
            query.$or = [
                { projectCode: { $regex: search, $options: "i" } },
                { projectName: { $regex: search, $options: "i" } },
                { branchName: { $regex: search, $options: "i" } }
            ];
        }

        // Project filter
        if (projectCode) {
            query.projectCode = projectCode;
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Organizational unit filter based on user permissions
        if (!req.user.permissions?.financialFlow?.includes('read:all')) {
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

        const result = await FinancialFlow.paginate(query, options);

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
        console.error("Get Financial Flows Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الخردوات المالية",
            error: error.message
        });
    }
};

// Get Financial Flow by ID
export const getFinancialFlowById = async (req, res) => {
    try {
        const financialFlow = await FinancialFlow.findById(req.params.id)
            .populate('project')
            .populate('createdBy', 'username fullName')
            .populate('organizationalUnit', 'name code');

        if (!financialFlow) {
            return res.status(404).json({
                success: false,
                message: "الخردوة المالية غير موجودة"
            });
        }

        res.json({
            success: true,
            data: financialFlow
        });
    } catch (error) {
        console.error("Get Financial Flow Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الخردوة المالية",
            error: error.message
        });
    }
};

// Get Financial Flows by Project
export const getFinancialFlowsByProject = async (req, res) => {
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

        const result = await FinancialFlow.paginate(query, options);

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
        console.error("Get Project Financial Flows Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب الخردوات المالية للمشروع",
            error: error.message
        });
    }
};

// Update Financial Flow
export const updateFinancialFlow = async (req, res) => {
    try {
        const financialFlow = await FinancialFlow.findById(req.params.id);

        if (!financialFlow) {
            return res.status(404).json({
                success: false,
                message: "الخردوة المالية غير موجودة"
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                financialFlow[key] = req.body[key];
            }
        });

        await financialFlow.save();
        await financialFlow.populate('project');

        res.json({
            success: true,
            data: financialFlow,
            message: "تم تحديث الخردوة المالية بنجاح"
        });
    } catch (error) {
        console.error("Update Financial Flow Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث الخردوة المالية",
            error: error.message
        });
    }
};

// Delete Financial Flow
export const deleteFinancialFlow = async (req, res) => {
    try {
        const financialFlow = await FinancialFlow.findByIdAndDelete(req.params.id);

        if (!financialFlow) {
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
        console.error("Delete Financial Flow Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء حذف الخردوة المالية",
            error: error.message
        });
    }
};

// Update specific tab data
export const updateCompanyOffers = async (req, res) => {
    try {
        const financialFlow = await FinancialFlow.findById(req.params.id);
        if (!financialFlow) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        financialFlow.companyOffers = req.body.companyOffers;
        await financialFlow.save();

        res.json({ success: true, data: financialFlow });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateTechnicalProcedures = async (req, res) => {
    try {
        const financialFlow = await FinancialFlow.findById(req.params.id);
        if (!financialFlow) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        financialFlow.technicalProcedures = {
            ...financialFlow.technicalProcedures,
            ...req.body
        };
        await financialFlow.save();

        res.json({ success: true, data: financialFlow });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateFinancialOpening = async (req, res) => {
    try {
        const financialFlow = await FinancialFlow.findById(req.params.id);
        if (!financialFlow) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        financialFlow.financialOpening = {
            ...financialFlow.financialOpening,
            ...req.body
        };
        await financialFlow.save();

        res.json({ success: true, data: financialFlow });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateCurrentFinancial = async (req, res) => {
    try {
        const financialFlow = await FinancialFlow.findById(req.params.id);
        if (!financialFlow) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        financialFlow.currentFinancial = {
            ...financialFlow.currentFinancial,
            ...req.body
        };
        await financialFlow.save();

        res.json({ success: true, data: financialFlow });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
