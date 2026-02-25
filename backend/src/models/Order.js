const mongoose = require('mongoose');

const orderTimelineSchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
});

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: Number,
  deliveryFee: Number,
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Processing', 'OnTheWay', 'Delivered', 'Cancelled'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trackingTimeline: [orderTimelineSchema],
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
