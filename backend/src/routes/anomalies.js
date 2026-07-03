const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const AnomalyController = require('../controllers/anomalyController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', AnomalyController.getAllAnomalies);
router.get('/:id', AnomalyController.getAnomalyById);
router.post('/scan', roleMiddleware(['admin']), AnomalyController.triggerAnomalyScan);
router.post('/:id/review', roleMiddleware(['admin', 'auditor']), AnomalyController.reviewAnomaly);
router.get('/trends/summary', AnomalyController.getAnomalyTrends);

module.exports = router;
