const allocations = {};

class AllocationController {
  static async getAllAllocations(req, res) {
    try {
      const { fund_id, state_id, status, page = 1, limit = 20 } = req.query;
      
      let allocationsList = Object.values(allocations);

      if (fund_id) allocationsList = allocationsList.filter(a => a.fund_id === fund_id);
      if (state_id) allocationsList = allocationsList.filter(a => a.state_id === state_id);
      if (status) allocationsList = allocationsList.filter(a => a.status === status);

      const startIndex = (page - 1) * limit;
      const paginatedAllocations = allocationsList.slice(startIndex, startIndex + parseInt(limit));

      res.json({
        success: true,
        data: paginatedAllocations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: allocationsList.length,
          pages: Math.ceil(allocationsList.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ALLOCATIONS_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getAllocationById(req, res) {
    try {
      const { id } = req.params;
      const allocation = allocations[id];

      if (!allocation) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Allocation not found'
          }
        });
      }

      res.json({
        success: true,
        data: allocation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ALLOCATION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async createAllocation(req, res) {
    try {
      const { fund_id, state_id, department_id, allocated_amount, allocation_date, description } = req.body;

      if (!fund_id || !state_id || !allocated_amount) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'fund_id, state_id, and allocated_amount are required'
          }
        });
      }

      const allocation = {
        id: Math.random().toString(36).substr(2, 9),
        fund_id,
        state_id,
        department_id,
        allocated_amount: parseFloat(allocated_amount),
        allocation_date,
        status: 'pending',
        description,
        created_by: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      };

      allocations[allocation.id] = allocation;

      res.status(201).json({
        success: true,
        message: 'Allocation created successfully',
        data: allocation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_ALLOCATION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async updateAllocation(req, res) {
    try {
      const { id } = req.params;
      const allocation = allocations[id];

      if (!allocation) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Allocation not found'
          }
        });
      }

      Object.assign(allocation, req.body, { updated_at: new Date() });
      allocations[id] = allocation;

      res.json({
        success: true,
        message: 'Allocation updated successfully',
        data: allocation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_ALLOCATION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async approveAllocation(req, res) {
    try {
      const { id } = req.params;
      const { approval_comment } = req.body;
      const allocation = allocations[id];

      if (!allocation) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Allocation not found'
          }
        });
      }

      allocation.status = 'approved';
      allocation.approved_by = req.user.id;
      allocation.approval_date = new Date();
      allocation.description = approval_comment || allocation.description;
      allocation.updated_at = new Date();

      allocations[id] = allocation;

      res.json({
        success: true,
        message: 'Allocation approved successfully',
        data: allocation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'APPROVE_ALLOCATION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async rejectAllocation(req, res) {
    try {
      const { id } = req.params;
      const { rejection_reason } = req.body;
      const allocation = allocations[id];

      if (!allocation) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Allocation not found'
          }
        });
      }

      allocation.status = 'rejected';
      allocation.approved_by = req.user.id;
      allocation.approval_date = new Date();
      allocation.description = rejection_reason || allocation.description;
      allocation.updated_at = new Date();

      allocations[id] = allocation;

      res.json({
        success: true,
        message: 'Allocation rejected successfully',
        data: allocation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'REJECT_ALLOCATION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getAllocationTransactions(req, res) {
    try {
      const { id } = req.params;
      const allocation = allocations[id];

      if (!allocation) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Allocation not found'
          }
        });
      }

      const transactions = [];

      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_TRANSACTIONS_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = AllocationController;
