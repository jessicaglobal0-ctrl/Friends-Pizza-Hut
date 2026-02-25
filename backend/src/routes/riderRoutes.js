const express = require('express');
const riderController = require('../controllers/riderController');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require rider role
router.use(auth('rider'));

// Dashboard
router.get('/orders/assigned', riderController.getAssignedOrders);
router.get('/orders/available', riderController.getAvailableOrders);
router.patch('/orders/:orderId/accept', riderController.acceptOrder);
router.patch('/orders/:orderId/reject', riderController.rejectOrder);
router.patch('/orders/:orderId/status', riderController.updateOrderStatus);
router.patch('/orders/:orderId/delivered', riderController.markDelivered);

// Tracking
router.post('/location', riderController.updateLocation);
router.get('/location', riderController.getLocation);

// Delivery history & earnings
router.get('/history', riderController.deliveryHistory);
router.get('/earnings', riderController.earningsSummary);

// Notifications
router.get('/notifications', riderController.getNotifications);

module.exports = router;
