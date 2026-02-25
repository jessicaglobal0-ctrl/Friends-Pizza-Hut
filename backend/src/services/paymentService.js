const Payment = require('../models/Payment');
const Order = require('../models/Order');
const crypto = require('crypto');

// Helper: Generate secure hash for JazzCash/Easypaisa/PayFast
function generateHash(params, secretKey) {
  const sorted = Object.keys(params).sort().map(k => params[k]).join('&');
  return crypto.createHmac('sha256', secretKey).update(sorted).digest('hex');
}

// JazzCash/Easypaisa/PayFast: Initiate payment (returns payment URL or session)
async function initiatePayment({ order, method, amount, user, callbackUrl }) {
  // For demo, simulate payment session
  // In production, call JazzCash/Easypaisa/PayFast API here
  const sessionId = crypto.randomBytes(16).toString('hex');
  return {
    paymentUrl: `https://pay.demo/${method.toLowerCase()}/pay?session=${sessionId}`,
    sessionId,
  };
}

// Webhook: Handle payment confirmation
async function handleWebhook({ gateway, body, headers }) {
  // Validate signature/hash
  // For demo, always valid
  // In production, verify using gateway secret
  const { orderId, status, transactionId, reference, amount } = body;
  const payment = await Payment.findOne({ order: orderId });
  if (!payment) throw new Error('Payment not found');
  if (payment.status === 'Paid') return { alreadyProcessed: true };
  // Validate amount
  const order = await Order.findById(orderId);
  if (!order || order.totalAmount !== amount) throw new Error('Amount mismatch');
  // Update payment and order
  payment.status = status === 'success' ? 'Paid' : 'Failed';
  payment.transactionId = transactionId;
  payment.reference = reference;
  payment.gatewayResponse = body;
  payment.auditLog.push({ event: 'webhook', body, headers, at: new Date() });
  await payment.save();
  if (payment.status === 'Paid') {
    order.status = 'Confirmed';
  } else {
    order.status = 'Payment Failed';
  }
  await order.save();
  return { payment, order };
}

// Manual mark COD as paid
async function markCodPaid(orderId) {
  const payment = await Payment.findOne({ order: orderId, method: 'COD' });
  if (!payment) throw new Error('Payment not found');
  payment.status = 'Paid';
  payment.auditLog.push({ event: 'manual-cod-paid', at: new Date() });
  await payment.save();
  const order = await Order.findByIdAndUpdate(orderId, { status: 'Confirmed' }, { new: true });
  return { payment, order };
}

// Get payment logs
async function getPaymentLogs({ status, method, order }) {
  const filter = {};
  if (status) filter.status = status;
  if (method) filter.method = method;
  if (order) filter.order = order;
  return Payment.find(filter).populate('order');
}

module.exports = {
  generateHash,
  initiatePayment,
  handleWebhook,
  markCodPaid,
  getPaymentLogs,
};
