const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const TransactionController = require('../controllers/transactionController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', TransactionController.getAllTransactions);
router.get('/:id', TransactionController.getTransactionById);
router.post('/', roleMiddleware(['admin', 'state_admin', 'department_head']), TransactionController.createTransaction);
router.put('/:id', roleMiddleware(['admin', 'state_admin']), TransactionController.updateTransaction);
router.get('/allocation/:allocationId', TransactionController.getTransactionsByAllocation);
router.get('/export/csv', TransactionController.exportTransactionsCSV);

module.exports = router;
