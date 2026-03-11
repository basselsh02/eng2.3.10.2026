const Memo = require('./Memo');
const CompanyOffer = require('./CompanyOffer');
const OfferItem = require('./OfferItem');
const CommitteeMember = require('./CommitteeMember');
const SupplyOrder = require('./SupplyOrder');
const SupplyOrderItem = require('./SupplyOrderItem');
const { 
  CommitteeType, 
  OfferType, 
  DecisionReason, 
  CommitteeRole, 
  FiscalYear,
  Unit,
  CategoryGroup
} = require('./LookupModels');

class MemosController {
  
  // ============ MEMO CRUD Operations ============
  
  /**
   * GET /api/memos/:id
   * Fetch full memo with all related data
   */
  async getMemo(req, res) {
    try {
      const { id } = req.params;
      
      const memo = await Memo.findById(id)
        .populate('fiscalYear')
        .populate('committeeType')
        .populate('projects')
        .populate({
          path: 'committeeMembers',
          populate: { path: 'role' }
        })
        .populate({
          path: 'companyOffers',
          populate: [
            { path: 'companyId' },
            { path: 'offerType' },
            { path: 'technicalDecisionReason' },
            { path: 'financialDecisionReason' },
            {
              path: 'items',
              populate: [
                { path: 'unit' },
                { path: 'decisionReason' }
              ]
            }
          ]
        })
        .populate({
          path: 'supplyOrders',
          populate: [
            { path: 'companyId' },
            { path: 'categoryGroupId' },
            {
              path: 'items',
              populate: { path: 'unit' }
            }
          ]
        });
      
      if (!memo) {
        return res.status(404).json({ error: 'Memo not found' });
      }
      
      res.json(memo);
    } catch (error) {
      console.error('Error fetching memo:', error);
      res.status(500).json({ error: 'Failed to fetch memo' });
    }
  }
  
  /**
   * GET /api/memos
   * List all memos with filters
   */
  async listMemos(req, res) {
    try {
      const { 
        status, 
        currentStage, 
        fiscalYear, 
        projectCode,
        page = 1,
        limit = 20
      } = req.query;
      
      const query = {};
      if (status) query.status = status;
      if (currentStage) query.currentStage = currentStage;
      if (fiscalYear) query.fiscalYear = fiscalYear;
      if (projectCode) query.projectCode = projectCode;
      
      const memos = await Memo.find(query)
        .populate('fiscalYear')
        .populate('committeeType')
        .populate('projects')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
      
      const total = await Memo.countDocuments(query);
      
      res.json({
        data: memos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error listing memos:', error);
      res.status(500).json({ error: 'Failed to list memos' });
    }
  }
  
  /**
   * POST /api/memos
   * Create new opening/decision memo
   */
  async createMemo(req, res) {
    try {
      const {
        refNumber,
        fiscalYear,
        projectCode,
        projects,
        committeeType,
        committeeDate,
        committeeStatement
      } = req.body;
      
      // Validate required fields
      if (!refNumber || !fiscalYear || !projectCode || !committeeType || !committeeDate) {
        return res.status(400).json({ 
          error: 'Missing required fields: refNumber, fiscalYear, projectCode, committeeType, committeeDate' 
        });
      }
      
      const memo = new Memo({
        refNumber,
        fiscalYear,
        projectCode,
        projects: projects || [],
        committeeType,
        committeeDate: new Date(committeeDate),
        committeeStatement: committeeStatement || '',
        createdBy: req.user._id,
        status: 'draft',
        currentStage: 'company_offers'
      });
      
      await memo.save();
      
      const populatedMemo = await Memo.findById(memo._id)
        .populate('fiscalYear')
        .populate('committeeType')
        .populate('projects');
      
      res.status(201).json(populatedMemo);
    } catch (error) {
      console.error('Error creating memo:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Reference number already exists' });
      }
      res.status(500).json({ error: 'Failed to create memo' });
    }
  }
  
  /**
   * PATCH /api/memos/:id
   * Update memo fields
   */
  async updateMemo(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Remove fields that shouldn't be updated directly
      delete updates._id;
      delete updates.createdBy;
      delete updates.createdAt;
      
      const memo = await Memo.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
        .populate('fiscalYear')
        .populate('committeeType')
        .populate('projects');
      
      if (!memo) {
        return res.status(404).json({ error: 'Memo not found' });
      }
      
      res.json(memo);
    } catch (error) {
      console.error('Error updating memo:', error);
      res.status(500).json({ error: 'Failed to update memo' });
    }
  }
  
  /**
   * DELETE /api/memos/:id
   * Delete memo (soft delete recommended)
   */
  async deleteMemo(req, res) {
    try {
      const { id } = req.params;
      
      // Soft delete by setting status to archived
      const memo = await Memo.findByIdAndUpdate(
        id,
        { status: 'archived', updatedAt: new Date() },
        { new: true }
      );
      
      if (!memo) {
        return res.status(404).json({ error: 'Memo not found' });
      }
      
      res.json({ message: 'Memo archived successfully', memo });
    } catch (error) {
      console.error('Error deleting memo:', error);
      res.status(500).json({ error: 'Failed to delete memo' });
    }
  }
  
  // ============ COMPANY OFFERS ============
  
  /**
   * GET /api/memos/:id/company-offers
   * List all company offers for this memo
   */
  async getCompanyOffers(req, res) {
    try {
      const { id } = req.params;
      
      const offers = await CompanyOffer.find({ memoId: id })
        .populate('companyId')
        .populate('offerType')
        .populate('technicalDecisionReason')
        .populate('financialDecisionReason')
        .populate({
          path: 'items',
          populate: [
            { path: 'unit' },
            { path: 'decisionReason' }
          ]
        })
        .sort({ sequenceOrder: 1 });
      
      res.json(offers);
    } catch (error) {
      console.error('Error fetching company offers:', error);
      res.status(500).json({ error: 'Failed to fetch company offers' });
    }
  }
  
  /**
   * POST /api/memos/:id/company-offers
   * Add a new company offer
   */
  async createCompanyOffer(req, res) {
    try {
      const { id } = req.params;
      const offerData = req.body;
      
      // Validate memo exists
      const memo = await Memo.findById(id);
      if (!memo) {
        return res.status(404).json({ error: 'Memo not found' });
      }
      
      const offer = new CompanyOffer({
        memoId: id,
        ...offerData,
        submissionDate: new Date(offerData.submissionDate),
        expiryDate: new Date(offerData.expiryDate),
        bidBondDate: offerData.bidBondDate ? new Date(offerData.bidBondDate) : null
      });
      
      await offer.save();
      
      const populatedOffer = await CompanyOffer.findById(offer._id)
        .populate('companyId')
        .populate('offerType');
      
      res.status(201).json(populatedOffer);
    } catch (error) {
      console.error('Error creating company offer:', error);
      res.status(500).json({ error: 'Failed to create company offer' });
    }
  }
  
  /**
   * PATCH /api/offers/:id
   * Update an offer (decision, discount, etc.)
   */
  async updateOffer(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      delete updates._id;
      delete updates.memoId;
      delete updates.createdAt;
      
      const offer = await CompanyOffer.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
        .populate('companyId')
        .populate('offerType')
        .populate('technicalDecisionReason')
        .populate('financialDecisionReason');
      
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }
      
      res.json(offer);
    } catch (error) {
      console.error('Error updating offer:', error);
      res.status(500).json({ error: 'Failed to update offer' });
    }
  }
  
  /**
   * DELETE /api/offers/:id
   * Delete an offer
   */
  async deleteOffer(req, res) {
    try {
      const { id } = req.params;
      
      // Delete associated offer items first
      await OfferItem.deleteMany({ offerId: id });
      
      const offer = await CompanyOffer.findByIdAndDelete(id);
      
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }
      
      res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
      console.error('Error deleting offer:', error);
      res.status(500).json({ error: 'Failed to delete offer' });
    }
  }
  
  // ============ OFFER ITEMS ============
  
  /**
   * GET /api/offers/:id/item-details
   * Get item-level details for an offer
   */
  async getOfferItems(req, res) {
    try {
      const { id } = req.params;
      
      const items = await OfferItem.find({ offerId: id })
        .populate('unit')
        .populate('decisionReason')
        .sort({ itemNumber: 1 });
      
      res.json(items);
    } catch (error) {
      console.error('Error fetching offer items:', error);
      res.status(500).json({ error: 'Failed to fetch offer items' });
    }
  }
  
  /**
   * POST /api/offers/:id/item-details
   * Add/update offer items
   */
  async upsertOfferItems(req, res) {
    try {
      const { id } = req.params;
      const { items } = req.body;
      
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Items must be an array' });
      }
      
      // Delete existing items and create new ones (replace strategy)
      await OfferItem.deleteMany({ offerId: id });
      
      const createdItems = [];
      for (const itemData of items) {
        const item = new OfferItem({
          offerId: id,
          ...itemData
        });
        await item.save();
        createdItems.push(item);
      }
      
      const populatedItems = await OfferItem.find({ offerId: id })
        .populate('unit')
        .populate('decisionReason')
        .sort({ itemNumber: 1 });
      
      res.json(populatedItems);
    } catch (error) {
      console.error('Error upserting offer items:', error);
      res.status(500).json({ error: 'Failed to save offer items' });
    }
  }
  
  // ============ COMMITTEE MEMBERS ============
  
  /**
   * GET /api/memos/:id/committee-members
   * Get committee members for a memo
   */
  async getCommitteeMembers(req, res) {
    try {
      const { id } = req.params;
      
      const members = await CommitteeMember.find({ memoId: id })
        .populate('role')
        .sort({ createdAt: 1 });
      
      res.json(members);
    } catch (error) {
      console.error('Error fetching committee members:', error);
      res.status(500).json({ error: 'Failed to fetch committee members' });
    }
  }
  
  /**
   * POST /api/memos/:id/committee-members
   * Add committee members
   */
  async addCommitteeMembers(req, res) {
    try {
      const { id } = req.params;
      const { members } = req.body;
      
      if (!Array.isArray(members)) {
        return res.status(400).json({ error: 'Members must be an array' });
      }
      
      const createdMembers = [];
      for (const memberData of members) {
        const member = new CommitteeMember({
          memoId: id,
          ...memberData
        });
        await member.save();
        createdMembers.push(member);
      }
      
      const populatedMembers = await CommitteeMember.find({ memoId: id })
        .populate('role');
      
      res.json(populatedMembers);
    } catch (error) {
      console.error('Error adding committee members:', error);
      res.status(500).json({ error: 'Failed to add committee members' });
    }
  }
  
  /**
   * PATCH /api/committee-members/:id
   * Update committee member
   */
  async updateCommitteeMember(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      delete updates._id;
      delete updates.memoId;
      
      const member = await CommitteeMember.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).populate('role');
      
      if (!member) {
        return res.status(404).json({ error: 'Committee member not found' });
      }
      
      res.json(member);
    } catch (error) {
      console.error('Error updating committee member:', error);
      res.status(500).json({ error: 'Failed to update committee member' });
    }
  }
  
  // ============ SUPPLY ORDERS ============
  
  /**
   * GET /api/supply-orders/:id
   * Get supply order details
   */
  async getSupplyOrder(req, res) {
    try {
      const { id } = req.params;
      
      const order = await SupplyOrder.findById(id)
        .populate('memoId')
        .populate('companyId')
        .populate('categoryGroupId')
        .populate({
          path: 'items',
          populate: { path: 'unit' }
        });
      
      if (!order) {
        return res.status(404).json({ error: 'Supply order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error fetching supply order:', error);
      res.status(500).json({ error: 'Failed to fetch supply order' });
    }
  }
  
  /**
   * POST /api/supply-orders
   * Create new supply order
   */
  async createSupplyOrder(req, res) {
    try {
      const orderData = req.body;
      
      const order = new SupplyOrder({
        ...orderData,
        orderDate: orderData.orderDate ? new Date(orderData.orderDate) : new Date()
      });
      
      await order.save();
      
      // Add items if provided
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const itemData of orderData.items) {
          const item = new SupplyOrderItem({
            orderId: order._id,
            ...itemData
          });
          await item.save();
        }
      }
      
      const populatedOrder = await SupplyOrder.findById(order._id)
        .populate('memoId')
        .populate('companyId')
        .populate('categoryGroupId')
        .populate({
          path: 'items',
          populate: { path: 'unit' }
        });
      
      res.status(201).json(populatedOrder);
    } catch (error) {
      console.error('Error creating supply order:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Order number already exists' });
      }
      res.status(500).json({ error: 'Failed to create supply order' });
    }
  }
  
  /**
   * PATCH /api/supply-orders/:id
   * Update supply order
   */
  async updateSupplyOrder(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      delete updates._id;
      delete updates.createdAt;
      
      const order = await SupplyOrder.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      )
        .populate('memoId')
        .populate('companyId')
        .populate('categoryGroupId');
      
      if (!order) {
        return res.status(404).json({ error: 'Supply order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error updating supply order:', error);
      res.status(500).json({ error: 'Failed to update supply order' });
    }
  }
  
  // ============ WORKFLOW STAGE ENDPOINTS ============
  
  /**
   * GET /api/memo/:id/opening-procedures
   * Technical opening procedures data
   */
  async getOpeningProcedures(req, res) {
    try {
      const { id } = req.params;
      
      const memo = await Memo.findById(id)
        .populate('committeeType')
        .populate({
          path: 'committeeMembers',
          populate: { path: 'role' }
        });
      
      const offers = await CompanyOffer.find({ memoId: id })
        .populate('companyId')
        .populate('offerType')
        .sort({ sequenceOrder: 1 });
      
      res.json({
        memo,
        offers,
        stage: 'technical_opening'
      });
    } catch (error) {
      console.error('Error fetching opening procedures:', error);
      res.status(500).json({ error: 'Failed to fetch opening procedures' });
    }
  }
  
  /**
   * GET /api/memo/:id/decision-procedures
   * Technical decision data
   */
  async getDecisionProcedures(req, res) {
    try {
      const { id } = req.params;
      
      const offers = await CompanyOffer.find({ memoId: id })
        .populate('companyId')
        .populate('offerType')
        .populate('technicalDecisionReason')
        .populate({
          path: 'items',
          populate: [
            { path: 'unit' },
            { path: 'decisionReason' }
          ]
        })
        .sort({ sequenceOrder: 1 });
      
      res.json({
        offers,
        stage: 'technical_decision'
      });
    } catch (error) {
      console.error('Error fetching decision procedures:', error);
      res.status(500).json({ error: 'Failed to fetch decision procedures' });
    }
  }
  
  /**
   * GET /api/memo/:id/financial-opening
   * Financial opening procedures data
   */
  async getFinancialOpening(req, res) {
    try {
      const { id } = req.params;
      
      // Only show offers that passed technical decision
      const offers = await CompanyOffer.find({ 
        memoId: id,
        technicalDecision: 'accepted'
      })
        .populate('companyId')
        .populate('offerType')
        .populate({
          path: 'items',
          populate: { path: 'unit' }
        })
        .sort({ sequenceOrder: 1 });
      
      res.json({
        offers,
        stage: 'financial_opening'
      });
    } catch (error) {
      console.error('Error fetching financial opening:', error);
      res.status(500).json({ error: 'Failed to fetch financial opening' });
    }
  }
  
  /**
   * GET /api/memo/:id/financial-decision
   * Financial decision data
   */
  async getFinancialDecision(req, res) {
    try {
      const { id } = req.params;
      
      const offers = await CompanyOffer.find({ 
        memoId: id,
        technicalDecision: 'accepted'
      })
        .populate('companyId')
        .populate('offerType')
        .populate('financialDecisionReason')
        .populate({
          path: 'items',
          populate: { path: 'unit' }
        })
        .sort({ valueAfterDiscount: 1 }); // Sort by lowest price
      
      res.json({
        offers,
        stage: 'financial_decision'
      });
    } catch (error) {
      console.error('Error fetching financial decision:', error);
      res.status(500).json({ error: 'Failed to fetch financial decision' });
    }
  }
  
  /**
   * POST /api/memo/:id/register-financial-winner
   * Record the financial winner
   */
  async registerFinancialWinner(req, res) {
    try {
      const { id } = req.params;
      const { offerId } = req.body;
      
      if (!offerId) {
        return res.status(400).json({ error: 'Offer ID is required' });
      }
      
      // Set all offers to rejected first
      await CompanyOffer.updateMany(
        { memoId: id, technicalDecision: 'accepted' },
        { financialDecision: 'rejected' }
      );
      
      // Set winner
      const winner = await CompanyOffer.findByIdAndUpdate(
        offerId,
        { financialDecision: 'winner' },
        { new: true }
      ).populate('companyId');
      
      if (!winner) {
        return res.status(404).json({ error: 'Offer not found' });
      }
      
      // Update memo stage
      await Memo.findByIdAndUpdate(id, {
        currentStage: 'supply_order',
        status: 'in_progress'
      });
      
      res.json({
        message: 'Financial winner registered successfully',
        winner
      });
    } catch (error) {
      console.error('Error registering financial winner:', error);
      res.status(500).json({ error: 'Failed to register financial winner' });
    }
  }
  
  // ============ LOOKUP DATA ENDPOINTS ============
  
  async getCommitteeTypes(req, res) {
    try {
      const types = await CommitteeType.find({ isActive: true });
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch committee types' });
    }
  }
  
  async getOfferTypes(req, res) {
    try {
      const types = await OfferType.find({ isActive: true });
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch offer types' });
    }
  }
  
  async getDecisionReasons(req, res) {
    try {
      const { type } = req.query;
      const query = { isActive: true };
      if (type) {
        query.type = { $in: [type, 'both'] };
      }
      const reasons = await DecisionReason.find(query);
      res.json(reasons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch decision reasons' });
    }
  }
  
  async getCommitteeRoles(req, res) {
    try {
      const roles = await CommitteeRole.find({ isActive: true });
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch committee roles' });
    }
  }
  
  async getFiscalYears(req, res) {
    try {
      const years = await FiscalYear.find({ isActive: true }).sort({ startDate: -1 });
      res.json(years);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch fiscal years' });
    }
  }
  
  async getUnits(req, res) {
    try {
      const units = await Unit.find({ isActive: true });
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch units' });
    }
  }
  
  async getCategoryGroups(req, res) {
    try {
      const groups = await CategoryGroup.find({ isActive: true });
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category groups' });
    }
  }
  
  // ============ PDF GENERATION ============
  
  /**
   * GET /api/memo/:id/print/:form
   * Generate PDF for any form (6a, 6b, 7, 9, 10a, 19...)
   */
  async printForm(req, res) {
    try {
      const { id, form } = req.params;
      
      // This would integrate with a PDF generation library
      // For now, returning a placeholder response
      res.json({
        message: 'PDF generation endpoint',
        memoId: id,
        formType: form,
        note: 'Integrate with PDF generation library (e.g., PDFKit, Puppeteer)'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }
}

module.exports = new MemosController();
