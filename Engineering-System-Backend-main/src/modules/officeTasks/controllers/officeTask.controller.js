import OfficeTask from "../models/officeTask.model.js";
import User from "../../User/models/user.model.js";
import catchAsync from "../../../utils/catchAsync.js";
import AppError from "../../../utils/AppError.js";

export const getOfficeTasks = catchAsync(async (req, res) => {
  const { office, page = 1, limit = 20 } = req.query;
  const filter = { isDeleted: false };

  if (office) {
    filter.office = office;
  }

  const result = await OfficeTask.paginate(filter, {
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 },
    populate: { path: "employee", select: "fullName fullNameArabic" },
  });

  res.json({
    success: true,
    data: result.docs,
    total: result.totalDocs,
    pages: result.totalPages,
  });
});

export const createOfficeTask = catchAsync(async (req, res) => {
  const task = await OfficeTask.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: task });
});

export const assignEmployee = catchAsync(async (req, res, next) => {
  const task = await OfficeTask.findById(req.params.id);

  if (!task || task.isDeleted) {
    return next(new AppError("المهمة غير موجودة", 404));
  }

  task.employee = req.body.employeeId;
  task.assignedAt = new Date();
  await task.save();

  res.json({ success: true, data: task });
});

export const assignAllEmployees = catchAsync(async (req, res, next) => {
  const task = await OfficeTask.findById(req.params.id);

  if (!task || task.isDeleted) {
    return next(new AppError("المهمة غير موجودة", 404));
  }

  const targetOffice = req.body.office || task.office;
  const employees = await User.find({ office: targetOffice, isDeleted: false }).select("_id");

  await OfficeTask.insertMany(
    employees.map((emp) => ({
      taskName: task.taskName,
      office: task.office,
      arrivedAt: task.arrivedAt,
      assignedAt: new Date(),
      employee: emp._id,
      exitDate: task.exitDate,
      notes: task.notes,
      createdBy: req.user._id,
    }))
  );

  res.json({ success: true, message: `تم التعيين لـ ${employees.length} موظف` });
});

export const updateOfficeTask = catchAsync(async (req, res, next) => {
  const task = await OfficeTask.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!task) {
    return next(new AppError("المهمة غير موجودة", 404));
  }

  res.json({ success: true, data: task });
});
