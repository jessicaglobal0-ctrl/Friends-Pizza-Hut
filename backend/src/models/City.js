const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  cityName: { type: String, required: true, unique: true },
  deliveryFee: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
