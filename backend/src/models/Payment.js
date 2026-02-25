const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  method: { type: String, enum: ['COD', 'JazzCash', 'Easypaisa', 'PayFast'], required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  transactionId: String,
  reference: String,
  gatewayResponse: mongoose.Schema.Types.Mixed,
  auditLog: [mongoose.Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
