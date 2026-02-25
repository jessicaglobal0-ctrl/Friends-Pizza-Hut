const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Joi = require('joi');

// Profile update
exports.updateProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      profileImage: Joi.string().uri(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, select: '-password' });
    res.json(user);
  } catch (err) { next(err); }
};

// Get user details
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) { next(err); }
};

// Address management
exports.addAddress = async (req, res, next) => {
  try {
    const schema = Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
      label: Joi.string(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: req.body } },
      { new: true, select: '-password' }
    );
    res.json(user.addresses);
  } catch (err) { next(err); }
};

exports.editAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const schema = Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      postalCode: Joi.string(),
      label: Joi.string(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    Object.assign(address, req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    user.addresses.id(addressId).remove();
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
};

// Order history
exports.orderHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

// Leave review
exports.leaveReview = async (req, res, next) => {
  try {
    const schema = Joi.object({
      product: Joi.string().required(),
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().allow(''),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const review = new Review({ ...req.body, user: req.user._id });
    await review.save();
    res.status(201).json(review);
  } catch (err) { next(err); }
};

// Notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) { next(err); }
};
