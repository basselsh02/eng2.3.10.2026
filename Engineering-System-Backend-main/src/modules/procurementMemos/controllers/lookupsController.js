import CommitteeType  from '../models/CommitteeType';
import OfferType from '../models/OfferType';
import DecisionReason from '../models/DecisionReason';
import FiscalYear from '../models/FiscalYear';
import Project from '../models/Project';
import Branch from '../models/Branch';
import Company from '../models/Company';
import Unit from '../models/Unit';

// ─── Committee Types ──────────────────────────────────────────────────────────

export const getCommitteeTypes = async (req, res) => {
  try {
    const data = await CommitteeType.find().sort({ name: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCommitteeType = async (req, res) => {
  try {
    const { name } = req.body;
    const data = await CommitteeType.create({ name });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Offer Types ──────────────────────────────────────────────────────────────

export const getOfferTypes = async (req, res) => {
  try {
    const data = await OfferType.find().sort({ name: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOfferType = async (req, res) => {
  try {
    const { name } = req.body;
    const data = await OfferType.create({ name });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Decision Reasons ─────────────────────────────────────────────────────────

export const getDecisionReasons = async (req, res) => {
  try {
    const data = await DecisionReason.find().sort({ reasonText: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDecisionReason = async (req, res) => {
  try {
    const { reasonText } = req.body;
    const data = await DecisionReason.create({ reasonText });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Fiscal Years ─────────────────────────────────────────────────────────────

export const getFiscalYears = async (req, res) => {
  try {
    const data = await FiscalYear.find().sort({ yearLabel: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFiscalYear = async (req, res) => {
  try {
    const { yearLabel } = req.body;
    const data = await FiscalYear.create({ yearLabel });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const getProjects = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(query);
    const data = await Project.find(query)
      .populate('branchId', 'code name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const data = await Project.findById(req.params.id).populate('branchId', 'code name');
    if (!data) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Companies ────────────────────────────────────────────────────────────────

export const getCompanies = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Company.countDocuments(query);
    const data = await Company.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Units ────────────────────────────────────────────────────────────────────

export const getUnits = async (req, res) => {
  try {
    const data = await Unit.find().sort({ name: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
