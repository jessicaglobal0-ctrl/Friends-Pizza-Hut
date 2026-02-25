const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth(['user', 'admin', 'rider']));

router.get('/me', userController.getMe);
router.put('/profile', userController.updateProfile);

// Address management
router.post('/addresses', userController.addAddress);
router.put('/addresses/:addressId', userController.editAddress);
router.delete('/addresses/:addressId', userController.deleteAddress);

// Order history
router.get('/orders', userController.orderHistory);

// Reviews
router.post('/reviews', userController.leaveReview);

// Notifications
router.get('/notifications', userController.getNotifications);

module.exports = router;
