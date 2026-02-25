const Order = require('../models/Order');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Joi = require('joi');

// View assigned orders
exports.getAssignedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ rider: req.user._id, status: { $in: ['Confirmed', 'Processing', 'OnTheWay'] } })
      .populate('user items.product city')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

// View available orders (if manual acceptance enabled)
exports.getAvailableOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: 'Confirmed', rider: null })
      .populate('user items.product city')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

// Accept order
exports.acceptOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.rider && order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Order already assigned' });
    }
    if (order.status !== 'Confirmed') {
      return res.status(400).json({ message: 'Order not available for acceptance' });
    }
    order.rider = req.user._id;
    order.status = 'Processing';
    order.trackingTimeline.push({ status: 'Processing' });
    await order.save();
    // Notify user
    await Notification.create({ user: order.user, title: 'Order Processing', message: 'Your order is being prepared.' });
    res.json(order);
  } catch (err) { next(err); }
};

// Reject order
exports.rejectOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.rider && order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Order not assigned to you' });
    }
    if (order.status !== 'Confirmed') {
      return res.status(400).json({ message: 'Order not available for rejection' });
    }
    order.rider = null;
    await order.save();
    res.json({ message: 'Order rejected' });
  } catch (err) { next(err); }
};

// Update order status (Processing → OnTheWay → Delivered)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const validTransitions = {
      Processing: ['OnTheWay'],
      OnTheWay: ['Delivered'],
    };
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.rider || order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Order not assigned to you' });
    }
    if (!validTransitions[order.status] || !validTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }
    order.status = status;
    order.trackingTimeline.push({ status });
    await order.save();
    // Notify user
    await Notification.create({ user: order.user, title: `Order ${status}`, message: `Your order status is now: ${status}` });
    res.json(order);
  } catch (err) { next(err); }
};

// Mark as delivered (shortcut)
exports.markDelivered = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.rider || order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Order not assigned to you' });
    }
    if (order.status !== 'OnTheWay') {
      return res.status(400).json({ message: 'Order not ready for delivery' });
    }
    order.status = 'Delivered';
    order.trackingTimeline.push({ status: 'Delivered' });
    await order.save();
    // Notify user
    await Notification.create({ user: order.user, title: 'Order Delivered', message: 'Thank you for your order!' });
    res.json(order);
  } catch (err) { next(err); }
};

// Update rider live location
exports.updateLocation = async (req, res, next) => {
  try {
    const schema = Joi.object({ latitude: Joi.number().required(), longitude: Joi.number().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    await User.findByIdAndUpdate(req.user._id, { lastLocation: req.body });
    res.json({ message: 'Location updated' });
  } catch (err) { next(err); }
};

// Get last known location
exports.getLocation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.lastLocation || {});
  } catch (err) { next(err); }
};

// Delivery history
exports.deliveryHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ rider: req.user._id, status: 'Delivered' })
      .populate('user items.product city')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

// Earnings summary
exports.earningsSummary = async (req, res, next) => {
  try {
    const orders = await Order.find({ rider: req.user._id, status: 'Delivered' });
    const totalDeliveries = orders.length;
    // For demo, assume fixed commission per order
    const commissionPerOrder = 100; // PKR
    const totalEarnings = totalDeliveries * commissionPerOrder;
    res.json({ totalDeliveries, totalEarnings });
  } catch (err) { next(err); }
};

// Notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) { next(err); }
};
