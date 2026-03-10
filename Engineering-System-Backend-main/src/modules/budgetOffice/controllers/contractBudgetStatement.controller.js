import ContractBudgetStatement from "../models/contractBudgetStatement.model.js";
import Project from "../../project/models/project.model.js";

// Create Contract Budget Statement
export const createContractBudgetStatement = async (req, res) => {
    try {
        const { projectId, ...statementData } = req.body;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "المشروع غير موجود"
            });
        }

        const statement = await ContractBudgetStatement.create({
            ...statementData,
            project: projectId,
            projectCode: project.projectCode,
            createdBy: req.user._id,
            organizationalUnit: req.user.organizationalUnit || project.organizationalUnit
        });

        await statement.populate('project');

        res.status(201).json({
            success: true,
            data: statement,
            message: "تم إنشاء بيان التعاقد والموازنة والصرف بنجاح"
        });
    } catch (error) {
        console.error("Create Contract Budget Statement Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء إنشاء بيان التعاقد والموازنة والصرف",
            error: error.message
        });
    }
};

// Get all Contract Budget Statements
export const getAllContractBudgetStatements = async (req, res) => {
    try {
        console.log("=== Budget Office getAllContractBudgetStatements CALLED ===");
        console.log("Query params:", req.query);
        
        const { 
            page = 1, 
            limit = 10, 
            search = "", 
            projectCode,
            status,
            financialYear
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { projectCode: { $regex: search, $options: "i" } },
                { 'projectData.projectName': { $regex: search, $options: "i" } },
                { 'contractualData.contractorName': { $regex: search, $options: "i" } },
                { 'contractualData.contractNumber': { $regex: search, $options: "i" } }
            ];
        }

        if (projectCode) {
            query.projectCode = projectCode;
        }

        if (status) {
            query.status = status;
        }

        if (financialYear) {
            query.financialYear = financialYear;
        }

        // TODO: Implement proper permission-based filtering later
        // Temporarily disabled to match Publishing Office behavior
        // if (!req.user.permissions?.contractBudgetStatement?.includes('read:all')) {
        //     query.organizationalUnit = req.user.organizationalUnit;
        // }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                { path: 'project', select: 'projectCode projectName projectType' },
                { path: 'createdBy', select: 'username fullNameArabic' },
                { path: 'organizationalUnit', select: 'name code' },
                { path: 'approvedBy', select: 'username fullNameArabic' }
            ]
        };

        const result = await ContractBudgetStatement.paginate(query, options);

        console.log("Query executed. Found documents:", result.docs.length);
        console.log("Total documents:", result.totalDocs);
        console.log("Response structure:", {
            success: true,
            dataLength: result.docs.length,
            pagination: {
                total: result.totalDocs,
                page: result.page,
                pages: result.totalPages
            }
        });

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
        console.error("Get Contract Budget Statements Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب بيانات التعاقد والموازنة والصرف",
            error: error.message
        });
    }
};

// Get Contract Budget Statement by ID
export const getContractBudgetStatementById = async (req, res) => {
    try {
        const statement = await ContractBudgetStatement.findById(req.params.id)
            .populate('project')
            .populate('createdBy', 'username fullNameArabic')
            .populate('updatedBy', 'username fullNameArabic')
            .populate('organizationalUnit', 'name code')
            .populate('approvedBy', 'username fullNameArabic');

        if (!statement) {
            return res.status(404).json({
                success: false,
                message: "بيان التعاقد والموازنة والصرف غير موجود"
            });
        }

        res.json({
            success: true,
            data: statement
        });
    } catch (error) {
        console.error("Get Contract Budget Statement Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب بيان التعاقد والموازنة والصرف",
            error: error.message
        });
    }
};

// Get Statements by Project
export const getStatementsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const query = { project: projectId };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                { path: 'createdBy', select: 'username fullNameArabic' },
                { path: 'organizationalUnit', select: 'name code' }
            ]
        };

        const result = await ContractBudgetStatement.paginate(query, options);

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
        console.error("Get Project Statements Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب بيانات المشروع",
            error: error.message
        });
    }
};

// Update Contract Budget Statement
export const updateContractBudgetStatement = async (req, res) => {
    try {
        const statement = await ContractBudgetStatement.findById(req.params.id);

        if (!statement) {
            return res.status(404).json({
                success: false,
                message: "بيان التعاقد والموازنة والصرف غير موجود"
            });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                statement[key] = req.body[key];
            }
        });

        statement.updatedBy = req.user._id;
        await statement.save();
        await statement.populate('project');

        res.json({
            success: true,
            data: statement,
            message: "تم تحديث بيان التعاقد والموازنة والصرف بنجاح"
        });
    } catch (error) {
        console.error("Update Contract Budget Statement Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث بيان التعاقد والموازنة والصرف",
            error: error.message
        });
    }
};

// Delete Contract Budget Statement
export const deleteContractBudgetStatement = async (req, res) => {
    try {
        const statement = await ContractBudgetStatement.findByIdAndDelete(req.params.id);

        if (!statement) {
            return res.status(404).json({
                success: false,
                message: "بيان التعاقد والموازنة والصرف غير موجود"
            });
        }

        res.json({
            success: true,
            message: "تم حذف بيان التعاقد والموازنة والصرف بنجاح"
        });
    } catch (error) {
        console.error("Delete Contract Budget Statement Error:", error);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء حذف بيان التعاقد والموازنة والصرف",
            error: error.message
        });
    }
};

// Update specific tabs
export const updateProjectData = async (req, res) => {
    try {
        const statement = await ContractBudgetStatement.findByIdAndUpdate(
            req.params.id,
            { 
                projectData: req.body,
                updatedBy: req.user._id
            },
            { new: true }
        ).populate('project');
        
        if (!statement) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: statement,
            message: "تم تحديث بيانات المشروع بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateContractualData = async (req, res) => {
    try {
        const statement = await ContractBudgetStatement.findByIdAndUpdate(
            req.params.id,
            { 
                contractualData: req.body,
                updatedBy: req.user._id
            },
            { new: true }
        ).populate('project');
        
        if (!statement) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: statement,
            message: "تم تحديث البيانات التعاقدية بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateDisbursementData = async (req, res) => {
    try {
        const statement = await ContractBudgetStatement.findByIdAndUpdate(
            req.params.id,
            { 
                disbursementData: req.body,
                updatedBy: req.user._id
            },
            { new: true }
        ).populate('project');
        
        if (!statement) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: statement,
            message: "تم تحديث بيانات الصرف بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateMaterialsDisbursement = async (req, res) => {
    try {
        const statement = await ContractBudgetStatement.findByIdAndUpdate(
            req.params.id,
            { 
                materialsDisbursement: req.body,
                updatedBy: req.user._id
            },
            { new: true }
        ).populate('project');
        
        if (!statement) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: statement,
            message: "تم تحديث بيانات صرف الخامات بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Approve/Reject Statement
export const approveStatement = async (req, res) => {
    try {
        const { approvalNotes } = req.body;
        
        const statement = await ContractBudgetStatement.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                approvedBy: req.user._id,
                approvalDate: new Date(),
                notes: approvalNotes || ''
            },
            { new: true }
        ).populate('project');

        if (!statement) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: statement,
            message: "تم الموافقة على البيان بنجاح"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const rejectStatement = async (req, res) => {
    try {
        const { rejectionNotes } = req.body;
        
        const statement = await ContractBudgetStatement.findByIdAndUpdate(
            req.params.id,
            {
                status: 'rejected',
                approvedBy: req.user._id,
                approvalDate: new Date(),
                notes: rejectionNotes || ''
            },
            { new: true }
        ).populate('project');

        if (!statement) {
            return res.status(404).json({ success: false, message: "غير موجود" });
        }

        res.json({ 
            success: true, 
            data: statement,
            message: "تم رفض البيان"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
