const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const router = express.Router();

// User: initiate payment (JazzCash/Easypaisa/PayFast/COD)
router.post('/initiate', auth(['user', 'admin']), paymentController.initiatePayment);

// Webhook: payment confirmation (no auth)
router.post('/webhook/:gateway', paymentController.paymentWebhook);

// Admin: mark COD as paid
router.patch('/cod/:orderId/mark-paid', auth('admin'), paymentController.markCodPaid);

// Admin: get payment logs
router.get('/logs', auth('admin'), paymentController.getPaymentLogs);

module.exports = router;
