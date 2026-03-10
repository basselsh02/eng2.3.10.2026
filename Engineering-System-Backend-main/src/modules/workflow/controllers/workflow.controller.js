import Workflow from "../models/workflow.model.js";
import WorkflowAssigneeHistory from "../models/workflowAssigneeHistory.model.js";
import Office from "../../office/models/office.model.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/AppError.js";
import mongoose from "mongoose";

// Create a new workflow
export const createWorkflow = catchAsync(async (req, res, next) => {
    const { name, processId, processType, stages, description } = req.body;

    // Validate required fields
    if (!name || !processId || !processType) {
        return next(new AppError("اسم سير العمل، معرف العملية، ونوع العملية مطلوبان", 400));
    }

    if (!stages || stages.length === 0) {
        return next(new AppError("يجب إضافة مرحلة واحدة على الأقل", 400));
    }

    // Validate all stage offices exist
    for (const stage of stages) {
        if (!mongoose.Types.ObjectId.isValid(stage.office)) {
            return next(new AppError("معرف المكتب/الكتيبة غير صحيح", 400));
        }

        const office = await Office.findById(stage.office);
        if (!office) {
            return next(new AppError(`المكتب/الكتيبة برقم ${stage.office} غير موجود`, 404));
        }
    }

    // Check if processId already exists
    const existingWorkflow = await Workflow.findOne({ processId });
    if (existingWorkflow) {
        return next(new AppError("معرف العملية موجود بالفعل", 400));
    }

    // Check for duplicate stage numbers
    const stageNumbers = stages.map(s => s.stageNumber);
    const uniqueNumbers = new Set(stageNumbers);
    if (stageNumbers.length !== uniqueNumbers.size) {
        return next(new AppError("لا يمكن أن تكون هناك مراحل بنفس الرقم", 400));
    }

    const newWorkflow = await Workflow.create({
        name,
        processId,
        processType,
        stages: stages.map(s => ({
            office: s.office,
            stageNumber: s.stageNumber,
            stageState: s.stageState || "waiting",
            numberOfReturns: 0,
            notes: s.notes || null,
            lastStateChangeAt: null,
            assignmentMode: s.assignmentMode || "manager_assigns",
            rememberAssignee: s.rememberAssignee || false
        })),
        createdBy: req.user._id,
        description: description || null
    });

    await newWorkflow.populate("stages.office", "name code type");
    await newWorkflow.populate("createdBy", "fullNameArabic");

    res.status(201).json({
        success: true,
        message: "تم إنشاء سير العمل بنجاح",
        data: newWorkflow
    });
});

// Get all workflows with filtering
export const getAllWorkflows = catchAsync(async (req, res, next) => {
    const { search, page = 1, limit = 10, processType, officeId, stageState, isActive } = req.query;

    const filters = {};

    // Add type filter if provided
    if (processType) {
        filters.processType = processType;
    }

    // Add office filter if provided
    if (officeId) {
        if (!mongoose.Types.ObjectId.isValid(officeId)) {
            return next(new AppError("معرف المكتب غير صحيح", 400));
        }
        filters["stages.office"] = new mongoose.Types.ObjectId(officeId);
    }

    // Add stage state filter if provided
    if (stageState && ["waiting", "active", "fulfilled", "returned"].includes(stageState)) {
        filters["stages.stageState"] = stageState;
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
            { processId: searchRegex },
            { processType: searchRegex }
        ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const workflows = await Workflow.find(filters)
        .populate("stages.office", "name code type")
        .populate("createdBy", "fullNameArabic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Workflow.countDocuments(filters);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
        success: true,
        data: {
            workflows,
            total,
            page: pageNum,
            totalPages,
            limit: limitNum
        }
    });
});

// Get workflow by ID
export const getWorkflowById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف سير العمل غير صحيح", 400));
    }

    const workflow = await Workflow.findById(id)
        .populate("stages.office", "name code type description managerId")
        .populate("createdBy", "fullNameArabic fullNameEnglish");

    if (!workflow) {
        return next(new AppError("سير العمل غير موجود", 404));
    }

    res.status(200).json({
        success: true,
        data: workflow
    });
});

// Update workflow (add/remove stages, edit workflow details)
export const updateWorkflow = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, stages, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف سير العمل غير صحيح", 400));
    }

    const workflow = await Workflow.findById(id);
    if (!workflow) {
        return next(new AppError("سير العمل غير موجود", 404));
    }

    // Update basic fields
    if (name) workflow.name = name;
    if (description !== undefined) workflow.description = description || null;
    if (isActive !== undefined) workflow.isActive = isActive;

    // Update stages if provided
    if (stages && Array.isArray(stages)) {
        if (stages.length === 0) {
            return next(new AppError("يجب أن تحتوي سير العمل على مرحلة واحدة على الأقل", 400));
        }

        // Validate all stage offices exist
        for (const stage of stages) {
            if (!mongoose.Types.ObjectId.isValid(stage.office)) {
                return next(new AppError("معرف المكتب/الكتيبة غير صحيح", 400));
            }

            const office = await Office.findById(stage.office);
            if (!office) {
                return next(new AppError(`المكتب/الكتيبة برقم ${stage.office} غير موجود`, 404));
            }
        }

        // Check for duplicate stage numbers
        const stageNumbers = stages.map(s => s.stageNumber);
        const uniqueNumbers = new Set(stageNumbers);
        if (stageNumbers.length !== uniqueNumbers.size) {
            return next(new AppError("لا يمكن أن تكون هناك مراحل بنفس الرقم", 400));
        }

        // Update stages while preserving state info for existing stages
        workflow.stages = stages.map(s => {
            const existingStage = workflow.stages.find(es => es.stageNumber === s.stageNumber);
            return {
                office: s.office,
                stageNumber: s.stageNumber,
                stageState: s.stageState || (existingStage ? existingStage.stageState : "waiting"),
                numberOfReturns: existingStage ? existingStage.numberOfReturns : 0,
                notes: s.notes || (existingStage ? existingStage.notes : null),
                lastStateChangeAt: existingStage ? existingStage.lastStateChangeAt : null,
                assignmentMode: s.assignmentMode || (existingStage ? existingStage.assignmentMode : "manager_assigns"),
                rememberAssignee: s.rememberAssignee !== undefined ? s.rememberAssignee : (existingStage ? existingStage.rememberAssignee : false)
            };
        });
    }

    await workflow.save();

    await workflow.populate("stages.office", "name code type");
    await workflow.populate("createdBy", "fullNameArabic");

    res.status(200).json({
        success: true,
        message: "تم تحديث سير العمل بنجاح",
        data: workflow
    });
});

// Delete workflow
export const deleteWorkflow = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف سير العمل غير صحيح", 400));
    }

    const workflow = await Workflow.findByIdAndDelete(id);

    if (!workflow) {
        return next(new AppError("سير العمل غير موجود", 404));
    }

    res.status(200).json({
        success: true,
        message: "تم حذف سير العمل بنجاح"
    });
});

// Update specific stage state
export const updateStageState = catchAsync(async (req, res, next) => {
    const { id, stageNumber } = req.params;
    const { stageState, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف سير العمل غير صحيح", 400));
    }

    if (!stageState || !["waiting", "active", "fulfilled", "returned"].includes(stageState)) {
        return next(new AppError("حالة المرحلة غير صحيحة", 400));
    }

    const workflow = await Workflow.findById(id);
    if (!workflow) {
        return next(new AppError("سير العمل غير موجود", 404));
    }

    const stage = workflow.stages.find(s => s.stageNumber === parseInt(stageNumber));
    if (!stage) {
        return next(new AppError("المرحلة غير موجودة", 404));
    }

    // Update stage state
    stage.stageState = stageState;
    stage.lastStateChangeAt = new Date();
    
    if (notes) {
        stage.notes = notes;
    }

    await workflow.save();

    await workflow.populate("stages.office", "name code type");

    res.status(200).json({
        success: true,
        message: "تم تحديث حالة المرحلة بنجاح",
        data: workflow
    });
});

// Mark stage as returned and increment return counter
export const returnStage = catchAsync(async (req, res, next) => {
    const { id, stageNumber } = req.params;
    const { notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("معرف سير العمل غير صحيح", 400));
    }

    const workflow = await Workflow.findById(id);
    if (!workflow) {
        return next(new AppError("سير العمل غير موجود", 404));
    }

    const stage = workflow.stages.find(s => s.stageNumber === parseInt(stageNumber));
    if (!stage) {
        return next(new AppError("المرحلة غير موجودة", 404));
    }

    // Update stage
    stage.stageState = "returned";
    stage.numberOfReturns = (stage.numberOfReturns || 0) + 1;
    stage.lastStateChangeAt = new Date();
    
    if (notes) {
        stage.notes = notes;
    }

    await workflow.save();

    await workflow.populate("stages.office", "name code type");

    res.status(200).json({
        success: true,
        message: `تم إرجاع المرحلة بنجاح (عدد الإرجاعات: ${stage.numberOfReturns})`,
        data: workflow
    });
});

// Get workflow by processId
export const getWorkflowByProcessId = catchAsync(async (req, res, next) => {
    const { processId } = req.params;

    const workflow = await Workflow.findOne({ processId })
        .populate("stages.office", "name code type")
        .populate("createdBy", "fullNameArabic");

    if (!workflow) {
        return next(new AppError("سير العمل غير موجود", 404));
    }

    res.status(200).json({
        success: true,
        data: workflow
    });
});

// Get workflow statistics
export const getWorkflowStats = catchAsync(async (req, res, next) => {
    const stats = await Workflow.aggregate([
        {
            $group: {
                _id: null,
                totalWorkflows: { $sum: 1 },
                activeWorkflows: {
                    $sum: { $cond: ["$isActive", 1, 0] }
                },
                totalStages: { $sum: "$metadata.totalStages" },
                completedStages: { $sum: "$metadata.completedStages" }
            }
        }
    ]);

    const byProcessType = await Workflow.aggregate([
        {
            $group: {
                _id: "$processType",
                count: { $sum: 1 },
                avgStages: { $avg: "$metadata.totalStages" }
            }
        },
        { $sort: { count: -1 } }
    ]);

    res.status(200).json({
        success: true,
        data: {
            overall: stats[0] || { totalWorkflows: 0, activeWorkflows: 0, totalStages: 0, completedStages: 0 },
            byProcessType
        }
    });
});

// Get suggested assignee for a workflow stage based on history
export const getSuggestedAssignee = catchAsync(async (req, res, next) => {
    const { workflowTemplateId, officeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(officeId)) {
        return next(new AppError("معرف المكتب غير صحيح", 400));
    }

    const history = await WorkflowAssigneeHistory.findOne({
        workflowTemplateId,
        officeId
    }).populate("employeeId", "fullNameArabic fullNameEnglish email");

    res.status(200).json({
        success: true,
        data: history || null
    });
});

// Update assignee history when a manager assigns an employee
export const updateAssigneeHistory = catchAsync(async (req, res, next) => {
    const { workflowTemplateId, officeId, employeeId } = req.body;

    if (!workflowTemplateId || !officeId || !employeeId) {
        return next(new AppError("جميع الحقول مطلوبة", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(officeId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
        return next(new AppError("معرف المكتب أو الموظف غير صحيح", 400));
    }

    // Upsert: update if exists, create if not
    const history = await WorkflowAssigneeHistory.findOneAndUpdate(
        { workflowTemplateId, officeId },
        { 
            employeeId,
            lastAssignedAt: new Date()
        },
        { 
            upsert: true, 
            new: true,
            runValidators: true
        }
    ).populate("employeeId", "fullNameArabic fullNameEnglish email");

    res.status(200).json({
        success: true,
        message: "تم تحديث سجل التعيين بنجاح",
        data: history
    });
});

// Get assignee history for an office
export const getOfficeAssigneeHistory = catchAsync(async (req, res, next) => {
    const { officeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(officeId)) {
        return next(new AppError("معرف المكتب غير صحيح", 400));
    }

    const history = await WorkflowAssigneeHistory.find({ officeId })
        .populate("employeeId", "fullNameArabic fullNameEnglish email")
        .populate("officeId", "name code")
        .sort({ lastAssignedAt: -1 });

    res.status(200).json({
        success: true,
        data: history
    });
});
