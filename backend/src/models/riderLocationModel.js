const mongoose = require('mongoose');

const riderLocationSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now, expires: 3600 }, // TTL: 1 hour
}, { timestamps: true });

module.exports = mongoose.model('RiderLocation', riderLocationSchema);
