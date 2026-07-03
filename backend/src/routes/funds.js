const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const FundController = require('../controllers/fundController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', FundController.getAllFunds);
router.get('/:id', FundController.getFundById);
router.post('/', roleMiddleware(['admin', 'state_admin']), FundController.createFund);
router.put('/:id', roleMiddleware(['admin', 'state_admin']), FundController.updateFund);
router.delete('/:id', roleMiddleware(['admin']), FundController.deleteFund);
router.get('/:id/allocations', FundController.getFundAllocations);
router.get('/:id/spending', FundController.getFundSpending);

module.exports = router;
