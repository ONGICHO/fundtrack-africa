const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const AnalyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', AnalyticsController.getDashboard);
router.get('/spending', AnalyticsController.getSpendingAnalysis);
router.get('/trends', AnalyticsController.getTrendAnalysis);
router.get('/allocation/by-state', AnalyticsController.getAllocationByState);
router.get('/allocation/by-department', AnalyticsController.getAllocationByDepartment);
router.post('/reports', AnalyticsController.generateReport);
router.get('/reports/:id', AnalyticsController.getReport);
router.post('/export', AnalyticsController.exportAnalytics);

module.exports = router;
