import GuaranteeLetter from "../models/guaranteeLetter.model.js";

export const getGuaranteeLetters = async (req, res) => {
  const projectCode = req.query.project_id || req.query.projectCode;
  const query = projectCode ? { projectCode } : {};
  const guaranteeLetters = await GuaranteeLetter.find(query).sort({ createdAt: -1 });

  res.json({ success: true, data: { guaranteeLetters } });
};

export const createGuaranteeLetter = async (req, res) => {
  const guaranteeLetter = await GuaranteeLetter.create(req.body);
  res.status(201).json({ success: true, data: guaranteeLetter });
};

export const updateGuaranteeLetter = async (req, res) => {
  const guaranteeLetter = await GuaranteeLetter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!guaranteeLetter) {
    return res.status(404).json({ success: false, message: "خطاب الضمان غير موجود" });
  }

  res.json({ success: true, data: guaranteeLetter });
};

export const renewGuaranteeLetter = async (req, res) => {
  const guaranteeLetter = await GuaranteeLetter.findByIdAndUpdate(
    req.params.id,
    {
      renewalDate: req.body.renewalDate || new Date(),
      ...req.body,
    },
    { new: true, runValidators: true }
  );

  if (!guaranteeLetter) {
    return res.status(404).json({ success: false, message: "خطاب الضمان غير موجود" });
  }

  res.json({ success: true, data: guaranteeLetter });
};

export const bulkRenewGuaranteeLetters = async (req, res) => {
  const { ids = [], renewalDate } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "يجب تمرير معرفات الخطابات" });
  }

  await GuaranteeLetter.updateMany(
    { _id: { $in: ids } },
    { $set: { renewalDate: renewalDate || new Date() } }
  );

  res.json({ success: true, message: "تم تجديد الخطابات بنجاح" });
};
