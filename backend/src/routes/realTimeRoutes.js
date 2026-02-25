const express = require('express');
const realTimeController = require('../controllers/realTimeController');
const auth = require('../middleware/auth');
const router = express.Router();

// Rider sends live location
router.post('/rider/location', auth('rider'), realTimeController.updateRiderLocation);
// Get last known location for order
router.get('/orders/:orderId/location', auth(['user', 'admin', 'rider']), realTimeController.getRiderLocation);
// Rider/admin updates order status
router.post('/orders/:orderId/status', auth(['rider', 'admin']), realTimeController.updateOrderStatus);
// Join order room (REST fallback)
router.post('/orders/:orderId/join', auth(['user', 'admin', 'rider']), realTimeController.joinOrderRoom);

module.exports = router;
