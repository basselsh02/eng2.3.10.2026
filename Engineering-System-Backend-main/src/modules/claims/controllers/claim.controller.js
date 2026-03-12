import ExcelJS from "exceljs";
import { AppError } from "../../../utils/AppError.js";
import Claim from "../models/claim.model.js";

export const getClaims = async (req, res) => {
  const projectCode = req.query.project_id || req.query.projectCode;
  const query = projectCode ? { projectCode } : {};
  const claims = await Claim.find(query).sort({ createdAt: -1 });

  res.json({ success: true, data: { claims } });
};

export const createClaim = async (req, res) => {
  const claim = await Claim.create(req.body);
  res.status(201).json({ success: true, data: claim });
};

export const updateClaim = async (req, res) => {
  const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!claim) {
    return res.status(404).json({ success: false, message: "المستخلص غير موجود" });
  }

  res.json({ success: true, data: claim });
};


export const exportToExcel = async (req, res, next) => {
  try {
    const search = req.body.search || "";
    const filters = req.body.filters ? JSON.parse(req.body.filters) : {};
    const query = {};
    if (search) query.$or = [{ projectCode: { $regex: search, $options: "i" } }, { claimNumber: { $regex: search, $options: "i" } }];
    Object.keys(filters).forEach((field) => {
      if (filters[field]) query[field] = { $regex: new RegExp(filters[field], "i") };
    });

    const docs = await Claim.find(query).sort({ createdAt: -1 }).lean();
    if (!docs.length) return next(new AppError("لا توجد بيانات للتصدير", 404));

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("البيانات");
    sheet.columns = [
      { header: "كود المشروع", key: "projectCode", width: 18 },
      { header: "رقم المستخلص", key: "claimNumber", width: 18 },
      { header: "تاريخ الورود", key: "archiveReceiptDate", width: 16 },
      { header: "تاريخ الخروج", key: "exitDate", width: 16 },
      { header: "ملاحظات الاستيفاء", key: "completionNotes", width: 32 },
    ];
    sheet.getRow(1).font = { bold: true };
    docs.forEach((doc) => sheet.addRow({
      projectCode: doc.projectCode || "",
      claimNumber: doc.claimNumber || "",
      archiveReceiptDate: doc.archiveReceiptDate ? new Date(doc.archiveReceiptDate).toLocaleDateString("ar-EG") : "",
      exitDate: doc.exitDate ? new Date(doc.exitDate).toLocaleDateString("ar-EG") : "",
      completionNotes: doc.completionNotes || doc.notes || "",
    }));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=claims_${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
