const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const ResourceController = require('../controllers/resourceController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ResourceController.getAllResources);
router.get('/:id', ResourceController.getResourceById);
router.post('/', ResourceController.createResource);
router.put('/:id', ResourceController.updateResource);
router.get('/:id/locations', ResourceController.getResourceLocations);
router.post('/:id/locations', ResourceController.updateResourceLocation);

module.exports = router;
