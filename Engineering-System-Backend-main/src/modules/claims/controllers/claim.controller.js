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
