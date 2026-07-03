const funds = {};

class FundController {
  static async getAllFunds(req, res) {
    try {
      const { fiscal_year, status, page = 1, limit = 20 } = req.query;
      
      let fundsList = Object.values(funds);

      if (fiscal_year) {
        fundsList = fundsList.filter(f => f.fiscal_year == fiscal_year);
      }
      if (status) {
        fundsList = fundsList.filter(f => f.status === status);
      }

      const startIndex = (page - 1) * limit;
      const paginatedFunds = fundsList.slice(startIndex, startIndex + parseInt(limit));

      res.json({
        success: true,
        data: paginatedFunds,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: fundsList.length,
          pages: Math.ceil(fundsList.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FUNDS_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getFundById(req, res) {
    try {
      const { id } = req.params;
      const fund = funds[id];

      if (!fund) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Fund not found'
          }
        });
      }

      res.json({
        success: true,
        data: fund
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FUND_ERROR',
          message: error.message
        }
      });
    }
  }

  static async createFund(req, res) {
    try {
      const { name, description, total_amount, source, fiscal_year } = req.body;

      if (!name || !total_amount || !fiscal_year) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name, total_amount, and fiscal_year are required'
          }
        });
      }

      const fund = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        total_amount: parseFloat(total_amount),
        allocated_amount: 0,
        remaining_amount: parseFloat(total_amount),
        source,
        fiscal_year,
        status: 'active',
        created_by: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      };

      funds[fund.id] = fund;

      res.status(201).json({
        success: true,
        message: 'Fund created successfully',
        data: fund
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_FUND_ERROR',
          message: error.message
        }
      });
    }
  }

  static async updateFund(req, res) {
    try {
      const { id } = req.params;
      const fund = funds[id];

      if (!fund) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Fund not found'
          }
        });
      }

      Object.assign(fund, req.body, { updated_at: new Date() });
      funds[id] = fund;

      res.json({
        success: true,
        message: 'Fund updated successfully',
        data: fund
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FUND_ERROR',
          message: error.message
        }
      });
    }
  }

  static async deleteFund(req, res) {
    try {
      const { id } = req.params;
      
      if (!funds[id]) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Fund not found'
          }
        });
      }

      delete funds[id];

      res.json({
        success: true,
        message: 'Fund deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FUND_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getFundAllocations(req, res) {
    try {
      const { id } = req.params;
      const fund = funds[id];

      if (!fund) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Fund not found'
          }
        });
      }

      const allocations = [];

      res.json({
        success: true,
        data: allocations
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

  static async getFundSpending(req, res) {
    try {
      const { id } = req.params;
      const fund = funds[id];

      if (!fund) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Fund not found'
          }
        });
      }

      const spending = {
        total_allocated: fund.allocated_amount,
        total_spent: fund.allocated_amount * 0.8,
        remaining: fund.remaining_amount,
        spending_percentage: Math.round((fund.allocated_amount / fund.total_amount) * 100)
      };

      res.json({
        success: true,
        data: spending
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_SPENDING_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = FundController;
