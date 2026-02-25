const Payment = require('../models/Payment');
const Order = require('../models/Order');
const paymentService = require('../services/paymentService');

// Initiate payment (JazzCash/Easypaisa/PayFast)
exports.initiatePayment = async (req, res, next) => {
  try {
    const { orderId, method, callbackUrl } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (method === 'COD') {
      // Create payment record and auto-confirm order
      const payment = new Payment({ order: orderId, method: 'COD', status: 'Paid' });
      await payment.save();
      order.status = 'Confirmed';
      await order.save();
      return res.json({ payment, order });
    }
    // Online payment
    const { paymentUrl, sessionId } = await paymentService.initiatePayment({
      order,
      method,
      amount: order.totalAmount,
      user: req.user,
      callbackUrl,
    });
    // Create payment record (Pending)
    const payment = new Payment({ order: orderId, method, status: 'Pending', reference: sessionId });
    await payment.save();
    order.status = 'Pending';
    await order.save();
    res.json({ paymentUrl, payment });
  } catch (err) { next(err); }
};

// Webhook for payment confirmation
exports.paymentWebhook = async (req, res, next) => {
  try {
    const { gateway } = req.params;
    const result = await paymentService.handleWebhook({ gateway, body: req.body, headers: req.headers });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

// Manual mark COD as paid (admin)
exports.markCodPaid = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await paymentService.markCodPaid(orderId);
    res.json(result);
  } catch (err) { next(err); }
};

// Get payment logs (admin)
exports.getPaymentLogs = async (req, res, next) => {
  try {
    const { status, method, order } = req.query;
    const logs = await paymentService.getPaymentLogs({ status, method, order });
    res.json(logs);
  } catch (err) { next(err); }
};
