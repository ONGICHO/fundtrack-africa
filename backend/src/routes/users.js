const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const UserController = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin']), UserController.getAllUsers);
router.get('/profile', UserController.getUserProfile);
router.post('/', roleMiddleware(['admin']), UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', roleMiddleware(['admin']), UserController.deleteUser);
router.get('/:id', UserController.getUserById);

module.exports = router;
