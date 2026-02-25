const RiderLocation = require('../models/riderLocationModel');
const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Joi = require('joi');
const socketService = require('../services/socketService');

// Rider sends live location
exports.updateRiderLocation = async (req, res, next) => {
  try {
    const schema = Joi.object({ orderId: Joi.string().required(), latitude: Joi.number().required(), longitude: Joi.number().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { orderId, latitude, longitude } = req.body;
    const order = await Order.findById(orderId);
    if (!order || !order.rider || order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this order' });
    }
    // Save location (upsert)
    await RiderLocation.findOneAndUpdate(
      { rider: req.user._id, order: orderId },
      { latitude, longitude, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    // Emit to order room
    socketService.emitToOrderRoom(orderId, 'riderLocationUpdate', { rider: req.user._id, latitude, longitude });
    res.json({ message: 'Location updated' });
  } catch (err) { next(err); }
};

// Get last known location for order
exports.getRiderLocation = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const loc = await RiderLocation.findOne({ order: orderId }).sort({ updatedAt: -1 });
    if (!loc) return res.status(404).json({ message: 'No location found' });
    res.json(loc);
  } catch (err) { next(err); }
};

// Rider or admin updates order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Only assigned rider or admin
    if (req.user.role === 'rider' && (!order.rider || order.rider.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this order' });
    }
    // Validate status transition
    const validTransitions = {
      Pending: ['Confirmed'],
      Confirmed: ['Processing'],
      Processing: ['OnTheWay'],
      OnTheWay: ['Delivered'],
      Delivered: [],
      Cancelled: [],
    };
    if (!validTransitions[order.status] || !validTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }
    order.status = status;
    order.trackingTimeline.push({ status });
    await order.save();
    // Emit to order room and admin
    socketService.emitToOrderRoom(orderId, 'orderStatusUpdate', { orderId, status });
    socketService.emitToAdmin('orderStatusUpdate', { orderId, status });
    // Push notification
    await Notification.create({ user: order.user, title: `Order ${status}`, message: `Your order status is now: ${status}` });
    res.json(order);
  } catch (err) { next(err); }
};

// Join order room (WebSocket handshake handled in socketService)
exports.joinOrderRoom = (req, res) => {
  res.json({ message: 'Join via WebSocket only' });
};
