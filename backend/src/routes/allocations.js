const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const AllocationController = require('../controllers/allocationController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', AllocationController.getAllAllocations);
router.get('/:id', AllocationController.getAllocationById);
router.post('/', roleMiddleware(['admin', 'state_admin', 'department_head']), AllocationController.createAllocation);
router.put('/:id', roleMiddleware(['admin', 'state_admin']), AllocationController.updateAllocation);
router.post('/:id/approve', roleMiddleware(['admin', 'state_admin']), AllocationController.approveAllocation);
router.post('/:id/reject', roleMiddleware(['admin', 'state_admin']), AllocationController.rejectAllocation);
router.get('/:id/transactions', AllocationController.getAllocationTransactions);

module.exports = router;
