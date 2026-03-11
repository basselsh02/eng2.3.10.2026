const SupplyOrder = require('../models/SupplyOrder');
const SupplyOrderItem = require('../models/SupplyOrderItem');
const Memo = require('../models/Memo');

// ─── Helper: compute supply-order derived fields ──────────────────────────────
const computeSupplyOrderFields = async (supplyOrder) => {
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

  return {
    ...supplyOrder.toObject(),
    items: computedItems,
    totalValue: Math.round(totalValue * 100) / 100,
    valueAfterDiscount: Math.round(valueAfterDiscount * 100) / 100,
    guaranteeValue: Math.round(guaranteeValue * 100) / 100,
  };
};

// ─── GET /api/supply-orders/:id ───────────────────────────────────────────────
exports.getSupplyOrderById = async (req, res) => {
  try {
    const supplyOrder = await SupplyOrder.findById(req.params.id)
      .populate('companyId', 'code name')
      .populate('memoId', 'refNumber documentType')
      .populate('categoryGroupId', 'name symbol');

    if (!supplyOrder) {
      return res.status(404).json({ success: false, message: 'Supply order not found' });
    }

    const data = await computeSupplyOrderFields(supplyOrder);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/supply-orders — create new supply order ───────────────────────
exports.createSupplyOrder = async (req, res) => {
  try {
    const {
      memoId,
      companyId,
      orderNumber,
      orderDate,
      subject,
      discountPercentage,
      guaranteePercentage,
      categoryGroupId,
      notes,
      items, // array of { itemNumber, unitId, quantity, unitPrice }
      group, // optional group/lot param (for duplicate create button)
    } = req.body;

    // Verify memo exists
    const memo = await Memo.findById(memoId);
    if (!memo) {
      return res.status(404).json({ success: false, message: 'Memo not found' });
    }

    // Auto-generate order number if not provided
    const resolvedOrderNumber =
      orderNumber ||
      (await generateOrderNumber());

    const supplyOrder = await SupplyOrder.create({
      memoId,
      companyId,
      orderNumber: resolvedOrderNumber,
      orderDate,
      subject,
      discountPercentage: discountPercentage || 0,
      guaranteePercentage: guaranteePercentage || 0,
      categoryGroupId,
      notes,
    });

    // Insert line items if provided
    if (Array.isArray(items) && items.length > 0) {
      await SupplyOrderItem.insertMany(
        items.map((item) => ({ ...item, orderId: supplyOrder._id }))
      );
    }

    const populated = await SupplyOrder.findById(supplyOrder._id)
      .populate('companyId', 'code name')
      .populate('memoId', 'refNumber documentType')
      .populate('categoryGroupId', 'name symbol');

    const data = await computeSupplyOrderFields(populated);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Helper: auto-generate sequential order number ────────────────────────────
async function generateOrderNumber() {
  const count = await SupplyOrder.countDocuments();
  const year = new Date().getFullYear().toString().slice(-2);
  return `${count + 1}/${year}`;
}

// ─── PRINT ENDPOINTS for supply orders ───────────────────────────────────────
const SUPPLY_ORDER_PRINT_FORMS = [
  'print',
  'form-19-1b',
  'form-1b-1',
  'treasury-report',
  'size-report',
  'deductions-minutes',
];

exports.printSupplyOrderForm = async (req, res) => {
  try {
    const { id, form } = req.params;

    const supplyOrder = await SupplyOrder.findById(id)
      .populate('companyId', 'code name')
      .populate('memoId', 'refNumber documentType')
      .populate('categoryGroupId', 'name symbol');

    if (!supplyOrder) {
      return res.status(404).json({ success: false, message: 'Supply order not found' });
    }

    if (!SUPPLY_ORDER_PRINT_FORMS.includes(form)) {
      return res.status(400).json({ success: false, message: `Unknown form: ${form}` });
    }

    const data = await computeSupplyOrderFields(supplyOrder);

    // TODO: integrate with PDF generator to produce actual PDF binary
    res.status(200).json({
      success: true,
      // TODO: replace with actual PDF generation
      data: {
        form,
        supplyOrderId: id,
        supplyOrder: data,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
