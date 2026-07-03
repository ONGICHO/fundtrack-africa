const transactions = {};

class TransactionController {
  static async getAllTransactions(req, res) {
    try {
      const { allocation_id, start_date, end_date, status, page = 1, limit = 20 } = req.query;
      
      let transactionsList = Object.values(transactions);

      if (allocation_id) transactionsList = transactionsList.filter(t => t.allocation_id === allocation_id);
      if (status) transactionsList = transactionsList.filter(t => t.status === status);
      if (start_date) transactionsList = transactionsList.filter(t => new Date(t.transaction_date) >= new Date(start_date));
      if (end_date) transactionsList = transactionsList.filter(t => new Date(t.transaction_date) <= new Date(end_date));

      const startIndex = (page - 1) * limit;
      const paginatedTransactions = transactionsList.slice(startIndex, startIndex + parseInt(limit));

      res.json({
        success: true,
        data: paginatedTransactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: transactionsList.length,
          pages: Math.ceil(transactionsList.length / limit)
        }
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

  static async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const transaction = transactions[id];

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Transaction not found'
          }
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_TRANSACTION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async createTransaction(req, res) {
    try {
      const { allocation_id, amount, transaction_date, transaction_type, description, reference_number } = req.body;

      if (!allocation_id || !amount) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'allocation_id and amount are required'
          }
        });
      }

      const transaction = {
        id: Math.random().toString(36).substr(2, 9),
        allocation_id,
        amount: parseFloat(amount),
        transaction_date,
        transaction_type,
        description,
        reference_number: reference_number || `TXN-${Date.now()}`,
        status: 'completed',
        created_by: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      };

      transactions[transaction.id] = transaction;

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_TRANSACTION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = transactions[id];

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Transaction not found'
          }
        });
      }

      Object.assign(transaction, req.body, { updated_at: new Date() });
      transactions[id] = transaction;

      res.json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_TRANSACTION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getTransactionsByAllocation(req, res) {
    try {
      const { allocationId } = req.params;
      const allocationTransactions = Object.values(transactions).filter(t => t.allocation_id === allocationId);

      res.json({
        success: true,
        data: allocationTransactions
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

  static async exportTransactionsCSV(req, res) {
    try {
      const transactionsList = Object.values(transactions);
      
      let csv = 'ID,Allocation ID,Amount,Date,Type,Description,Reference,Status\n';
      transactionsList.forEach(t => {
        csv += `${t.id},${t.allocation_id},${t.amount},${t.transaction_date},${t.transaction_type},${t.description},${t.reference_number},${t.status}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'EXPORT_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = TransactionController;
