import Memo from '../models/Memo';
import CommitteeMember from '../models/CommitteeMember';
import Offer from '../models/Offer';
import OfferItem from '../models/OfferItem';
import Project from '../models/Project';

// ─── Helper: compute offer-level derived fields ───────────────────────────────
const computeOfferFields = (offer) => {
  const valueAfterDiscount =
    offer.financialValue - (offer.financialValue * (offer.discountPercentage || 0)) / 100;
  return {
    ...offer.toObject(),
    valueAfterDiscount: Math.round(valueAfterDiscount * 100) / 100,
  };
};

// ─── Helper: compute offer-item derived fields ────────────────────────────────
const computeItemFields = (item) => {
  const priceAfterDiscount = (item.unitPrice || 0) - (item.discount || 0);
  const total = (item.quantity || 0) * priceAfterDiscount;
  // Financial-tab fields
  const financialPriceAfterDiscount = (item.companyPrice || 0) - (item.discountAmount || 0);
  const financialTotal = (item.quantity || 0) * financialPriceAfterDiscount;
  return {
    ...item.toObject(),
    priceAfterDiscount: Math.round(priceAfterDiscount * 100) / 100,
    total: Math.round(total * 100) / 100,
    financialPriceAfterDiscount: Math.round(financialPriceAfterDiscount * 100) / 100,
    financialTotal: Math.round(financialTotal * 100) / 100,
  };
};

// ─── Helper: build full memo with all nested data ─────────────────────────────
const buildFullMemo = async (memo) => {
  const [members, offers] = await Promise.all([
    CommitteeMember.find({ memoId: memo._id })
      .populate('roleId', 'name')
      .sort({ createdAt: 1 }),
    Offer.find({ memoId: memo._id })
      .populate('companyId', 'code name')
      .populate('offerTypeId', 'name')
      .populate('rulingId', 'reasonText')
      .sort({ sequenceNumber: 1 }),
  ]);

  const offersWithItems = await Promise.all(
    offers.map(async (offer) => {
      const items = await OfferItem.find({ offerId: offer._id })
        .populate('unitId', 'name symbol')
        .populate('reasonId', 'reasonText')
        .sort({ itemNumber: 1 });
      return {
        ...computeOfferFields(offer),
        items: items.map(computeItemFields),
      };
    })
  );

  return {
    ...memo.toObject(),
    committeeMembers: members,
    offers: offersWithItems,
  };
};

// ─── GET /api/memos — list all memos (paginated) ──────────────────────────────
exports.getMemos = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { refNumber: { $regex: search, $options: 'i' } },
        { documentType: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Memo.countDocuments(query);
    const memos = await Memo.find(query)
      .populate('fiscalYear', 'yearLabel')
      .populate('projectId', 'code name totalCost branchId')
      .populate('committeeTypeId', 'name')
      .populate('financialWinnerId', 'code name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: memos,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/memos/:id — fetch full memo ─────────────────────────────────────
exports.getMemoById = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id)
      .populate('fiscalYear', 'yearLabel')
      .populate({
        path: 'projectId',
        populate: { path: 'branchId', select: 'code name' },
      })
      .populate('committeeTypeId', 'name')
      .populate('financialWinnerId', 'code name');

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const data = await buildFullMemo(memo);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/memos — create new memo ────────────────────────────────────────
exports.createMemo = async (req, res) => {
  try {
    const {
      refNumber,
      documentType,
      fiscalYear,
      projectId,
      committeeTypeId,
      committeeDate,
      committeeStatement,
    } = req.body;

    const memo = await Memo.create({
      refNumber,
      documentType,
      fiscalYear,
      projectId,
      committeeTypeId,
      committeeDate,
      committeeStatement,
    });

    const populated = await Memo.findById(memo._id)
      .populate('fiscalYear', 'yearLabel')
      .populate({
        path: 'projectId',
        populate: { path: 'branchId', select: 'code name' },
      })
      .populate('committeeTypeId', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── PATCH /api/memos/:id — update memo fields ────────────────────────────────
exports.updateMemo = async (req, res) => {
  try {
    const allowedFields = [
      'refNumber',
      'documentType',
      'fiscalYear',
      'projectId',
      'committeeTypeId',
      'committeeDate',
      'committeeStatement',
      'currentStage',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const memo = await Memo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('fiscalYear', 'yearLabel')
      .populate({
        path: 'projectId',
        populate: { path: 'branchId', select: 'code name' },
      })
      .populate('committeeTypeId', 'name')
      .populate('financialWinnerId', 'code name');

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    res.status(200).json({ success: true, data: memo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── GET /api/memos/:id/company-offers ───────────────────────────────────────
// Tab 1: عروض الشركات
exports.getCompanyOffers = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const offers = await Offer.find({ memoId: req.params.id })
      .populate('companyId', 'code name')
      .populate('offerTypeId', 'name')
      .sort({ sequenceNumber: 1 });

    const offersWithItems = await Promise.all(
      offers.map(async (offer) => {
        const items = await OfferItem.find({ offerId: offer._id })
          .populate('unitId', 'name symbol')
          .populate('reasonId', 'reasonText')
          .sort({ itemNumber: 1 });
        return {
          ...computeOfferFields(offer),
          items: items.map(computeItemFields),
        };
      })
    );

    res.status(200).json({ success: true, data: offersWithItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/memos/:id/company-offers — add a company offer ─────────────────
exports.addCompanyOffer = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const {
      companyId,
      offerTypeId,
      sequenceNumber,
      offerNumber,
      sequenceOrder,
      submissionDate,
      expiryDate,
      securityApprovalNumber,
      bidBondDetails,
      bidBondDate,
      documentCount,
    } = req.body;

    const offer = await Offer.create({
      memoId: req.params.id,
      companyId,
      offerTypeId,
      sequenceNumber,
      offerNumber,
      sequenceOrder,
      submissionDate,
      expiryDate,
      securityApprovalNumber,
      bidBondDetails,
      bidBondDate,
      documentCount,
    });

    const populated = await Offer.findById(offer._id)
      .populate('companyId', 'code name')
      .populate('offerTypeId', 'name');

    res.status(201).json({ success: true, data: computeOfferFields(populated) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── PATCH /api/offers/:id — update any offer field ──────────────────────────
exports.updateOffer = async (req, res) => {
  try {
    const allowedFields = [
      'companyId',
      'offerTypeId',
      'sequenceNumber',
      'offerNumber',
      'sequenceOrder',
      'submissionDate',
      'expiryDate',
      'securityApprovalNumber',
      'bidBondDetails',
      'bidBondDate',
      'documentCount',
      'financialDocsStatus',
      'financialValue',
      'itemNumbers',
      'reviewedValue',
      'discountPercentage',
      'isExcluded',
      'committeeDecision',
      'technicalDecisionDate',
      'rulingId',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const offer = await Offer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('companyId', 'code name')
      .populate('offerTypeId', 'name')
      .populate('rulingId', 'reasonText');

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.status(200).json({ success: true, data: computeOfferFields(offer) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── GET /api/offers/:id/item-details ─────────────────────────────────────────
// بيان عرض الشركة من الاصناف
exports.getOfferItems = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    const items = await OfferItem.find({ offerId: req.params.id })
      .populate('unitId', 'name symbol')
      .populate('reasonId', 'reasonText')
      .sort({ itemNumber: 1 });

    const computed = items.map(computeItemFields);

    // Grand total
    const grandTotal = computed.reduce((sum, item) => sum + (item.total || 0), 0);

    res.status(200).json({ success: true, data: computed, grandTotal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/offers/:id/item-details — add/replace offer items ──────────────
exports.upsertOfferItems = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items must be an array' });
    }

    // Delete existing items and replace
    await OfferItem.deleteMany({ offerId: req.params.id });

    const created = await OfferItem.insertMany(
      items.map((item) => ({ ...item, offerId: req.params.id }))
    );

    const populated = await OfferItem.find({ offerId: req.params.id })
      .populate('unitId', 'name symbol')
      .populate('reasonId', 'reasonText')
      .sort({ itemNumber: 1 });

    const computed = populated.map(computeItemFields);
    const grandTotal = computed.reduce((sum, item) => sum + (item.total || 0), 0);

    res.status(201).json({ success: true, data: computed, grandTotal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── GET /api/memos/:id/opening-procedures — Tab: اجراءات الفتح الفني ─────────
exports.getTechnicalOpeningProcedures = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id)
      .populate('fiscalYear', 'yearLabel')
      .populate('committeeTypeId', 'name')
      .populate({ path: 'projectId', populate: { path: 'branchId', select: 'code name' } });

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const [members, offers] = await Promise.all([
      CommitteeMember.find({ memoId: memo._id })
        .populate('roleId', 'name')
        .sort({ createdAt: 1 }),
      Offer.find({ memoId: memo._id })
        .populate('companyId', 'code name')
        .populate('offerTypeId', 'name')
        .sort({ sequenceNumber: 1 }),
    ]);

    res.status(200).json({
      success: true,
      data: { memo, committeeMembers: members, offers },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/memos/:id/decision-procedures — Tab: اجراءات البت الفني ──────────
exports.getTechnicalDecisionProcedures = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id)
      .populate('fiscalYear', 'yearLabel')
      .populate('committeeTypeId', 'name')
      .populate({ path: 'projectId', populate: { path: 'branchId', select: 'code name' } });

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const [members, offers] = await Promise.all([
      CommitteeMember.find({ memoId: memo._id })
        .populate('roleId', 'name')
        .sort({ createdAt: 1 }),
      Offer.find({ memoId: memo._id })
        .populate('companyId', 'code name')
        .populate('offerTypeId', 'name')
        .populate('rulingId', 'reasonText')
        .sort({ sequenceNumber: 1 }),
    ]);

    const offersWithItems = await Promise.all(
      offers.map(async (offer) => {
        const items = await OfferItem.find({ offerId: offer._id })
          .populate('unitId', 'name symbol')
          .populate('reasonId', 'reasonText')
          .sort({ itemNumber: 1 });
        return {
          ...computeOfferFields(offer),
          items: items.map(computeItemFields),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { memo, committeeMembers: members, offers: offersWithItems },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/memos/:id/financial-opening — Tab: اجراءات الفتح المالي ─────────
exports.getFinancialOpeningProcedures = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id)
      .populate('fiscalYear', 'yearLabel')
      .populate('committeeTypeId', 'name')
      .populate({ path: 'projectId', populate: { path: 'branchId', select: 'code name' } });

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const [members, offers] = await Promise.all([
      CommitteeMember.find({ memoId: memo._id })
        .populate('roleId', 'name')
        .sort({ createdAt: 1 }),
      Offer.find({ memoId: memo._id })
        .populate('companyId', 'code name')
        .populate('offerTypeId', 'name')
        .sort({ sequenceNumber: 1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        memo,
        committeeMembers: members,
        offers: offers.map(computeOfferFields),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/memos/:id/accounting-review — trigger accounting review ─────────
exports.triggerAccountingReview = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }
    // TODO: integrate with accounting review workflow
    res.status(200).json({
      success: true,
      message: 'Accounting review triggered successfully',
      data: { memoId: req.params.id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/memos/:id/financial-decision — Tab: اجراءات البت المالي ──────────
exports.getFinancialDecisionProcedures = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id)
      .populate('fiscalYear', 'yearLabel')
      .populate('committeeTypeId', 'name')
      .populate({ path: 'projectId', populate: { path: 'branchId', select: 'code name' } });

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const [members, offers] = await Promise.all([
      CommitteeMember.find({ memoId: memo._id })
        .populate('roleId', 'name')
        .sort({ createdAt: 1 }),
      Offer.find({ memoId: memo._id })
        .populate('companyId', 'code name')
        .populate('offerTypeId', 'name')
        .sort({ sequenceNumber: 1 }),
    ]);

    const offersWithItems = await Promise.all(
      offers.map(async (offer) => {
        const items = await OfferItem.find({ offerId: offer._id })
          .populate('unitId', 'name symbol')
          .sort({ itemNumber: 1 });

        const computedItems = items.map((item) => {
          const priceAfterDiscount = (item.companyPrice || 0) - (item.discountAmount || 0);
          const total = (item.quantity || 0) * priceAfterDiscount;
          return {
            ...item.toObject(),
            priceAfterDiscount: Math.round(priceAfterDiscount * 100) / 100,
            total: Math.round(total * 100) / 100,
          };
        });

        const itemsGrandTotal = computedItems.reduce((sum, i) => sum + (i.total || 0), 0);

        return {
          ...computeOfferFields(offer),
          items: computedItems,
          itemsGrandTotal: Math.round(itemsGrandTotal * 100) / 100,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { memo, committeeMembers: members, offers: offersWithItems },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/memos/:id/register-financial-winner ────────────────────────────
exports.registerFinancialWinner = async (req, res) => {
  try {
    const { companyId } = req.body;
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'companyId is required' });
    }

    const memo = await Memo.findByIdAndUpdate(
      req.params.id,
      {
        financialWinnerId: companyId,
        financialWinnerRegisteredAt: new Date(),
      },
      { new: true, runValidators: true }
    )
      .populate('financialWinnerId', 'code name')
      .populate('fiscalYear', 'yearLabel');

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Financial winner registered successfully',
      data: memo,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── POST /api/memos/:id/distribute-companies ─────────────────────────────────
exports.distributeCompanies = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }
    // TODO: implement distribution logic (stage 1)
    res.status(200).json({
      success: true,
      message: 'Companies distributed successfully',
      data: { memoId: req.params.id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/memos/:id/supply-order — Tab: أمر التوريد ───────────────────────
exports.getSupplyOrder = async (req, res) => {
  try {
    import SupplyOrder from '../models/SupplyOrder';
    import SupplyOrderItem from '../models/SupplyOrderItem';
    import BudgetAllocation from '../models/BudgetAllocation';

    const memo = await Memo.findById(req.params.id)
      .populate('fiscalYear', 'yearLabel')
      .populate({ path: 'projectId', populate: { path: 'branchId', select: 'code name' } });

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    const supplyOrder = await SupplyOrder.findOne({ memoId: req.params.id })
      .populate('companyId', 'code name')
      .populate('categoryGroupId', 'name symbol');

    let supplyOrderData = null;
    if (supplyOrder) {
      const items = await SupplyOrderItem.find({ orderId: supplyOrder._id })
        .populate('unitId', 'name symbol')
        .sort({ itemNumber: 1 });

      const computedItems = items.map((item) => ({
        ...item.toObject(),
        total: Math.round((item.quantity || 0) * (item.unitPrice || 0) * 100) / 100,
      }));

      const totalValue = computedItems.reduce((sum, i) => sum + (i.total || 0), 0);
      const valueAfterDiscount =
        totalValue - (totalValue * (supplyOrder.discountPercentage || 0)) / 100;
      const guaranteeValue =
        (valueAfterDiscount * (supplyOrder.guaranteePercentage || 0)) / 100;

      supplyOrderData = {
        ...supplyOrder.toObject(),
        items: computedItems,
        totalValue: Math.round(totalValue * 100) / 100,
        valueAfterDiscount: Math.round(valueAfterDiscount * 100) / 100,
        guaranteeValue: Math.round(guaranteeValue * 100) / 100,
      };
    }

    const budgetAllocations = await BudgetAllocation.find({ projectId: memo.projectId })
      .populate('projectId', 'code name description')
      .sort({ code: 1 });

    res.status(200).json({
      success: true,
      data: { memo, supplyOrder: supplyOrderData, budgetAllocations },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PRINT ENDPOINTS for memo ─────────────────────────────────────────────────
// Each form returns { success, data } with a TODO for the actual PDF generator
const MEMO_PRINT_FORMS = [
  'form-6a',
  'form-6b',
  'form-6c',
  'form-7',
  'form-9',
  'form-10a',
  'form-10b',
  'form-1a',
  'decision-letter',
  'committee-letter',
  'form-12a',
  'form-12b',
  '182-12',
  'form-16b-182',
  'technical-opening-request',
  'form-19',
  'form-19b',
  'form-16b-2',
  'minutes-1',
  'minutes-2',
  '15-182',
];

exports.printMemoForm = async (req, res) => {
  try {
    const { id, form } = req.params;

    const memo = await Memo.findById(id)
      .populate('fiscalYear', 'yearLabel')
      .populate({ path: 'projectId', populate: { path: 'branchId', select: 'code name' } })
      .populate('committeeTypeId', 'name')
      .populate('financialWinnerId', 'code name');

    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    if (!MEMO_PRINT_FORMS.includes(form)) {
      return res.status(400).json({ success: false, message: `Unknown form: ${form}` });
    }

    // TODO: integrate with PDF generator to produce actual PDF binary
    // For now return the data payload that the PDF template will consume
    res.status(200).json({
      success: true,
      // TODO: replace with actual PDF generation
      data: {
        form,
        memoId: id,
        memo,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
