const Product = require('../models/Product');
const Category = require('../models/Category');
const City = require('../models/City');
const Order = require('../models/Order');
const User = require('../models/User');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Joi = require('joi');

// Product Management
exports.addProduct = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      price: Joi.number().required(),
      discountPrice: Joi.number().allow(null),
      category: Joi.string().required(),
      images: Joi.array().items(Joi.string().uri()),
      preparationTime: Joi.number(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const product = new Product({ ...req.body });
    await product.save();
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const schema = Joi.object({
      name: Joi.string(),
      description: Joi.string().allow(''),
      price: Joi.number(),
      discountPrice: Joi.number().allow(null),
      category: Joi.string(),
      images: Joi.array().items(Joi.string().uri()),
      preparationTime: Joi.number(),
      isAvailable: Joi.boolean(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const product = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product soft deleted' });
  } catch (err) { next(err); }
};

exports.toggleProductAvailability = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isAvailable = !product.isAvailable;
    await product.save();
    res.json(product);
  } catch (err) { next(err); }
};

// Category Management
exports.addCategory = async (req, res, next) => {
  try {
    const schema = Joi.object({ name: Joi.string().required(), image: Joi.string().uri().allow(''), });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const category = new Category({ ...req.body });
    await category.save();
    res.status(201).json(category);
  } catch (err) { next(err); }
};

exports.editCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const schema = Joi.object({ name: Joi.string(), image: Joi.string().uri().allow(''), isActive: Joi.boolean() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const category = await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
};

// City Management
exports.addCity = async (req, res, next) => {
  try {
    const schema = Joi.object({ cityName: Joi.string().required(), deliveryFee: Joi.number().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const city = new City({ ...req.body });
    await city.save();
    res.status(201).json(city);
  } catch (err) { next(err); }
};

exports.editCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const schema = Joi.object({ cityName: Joi.string(), deliveryFee: Joi.number(), isActive: Joi.boolean() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const city = await City.findByIdAndUpdate(cityId, req.body, { new: true });
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (err) { next(err); }
};

exports.deleteCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    await City.findByIdAndDelete(cityId);
    res.json({ message: 'City deleted' });
  } catch (err) { next(err); }
};

// Order Management
exports.getOrders = async (req, res, next) => {
  try {
    const { status, city, rider, user } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = city;
    if (rider) filter.rider = rider;
    if (user) filter.user = user;
    const orders = await Order.find(filter).populate('user rider items.product city').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    order.trackingTimeline.push({ status });
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
};

exports.assignRider = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { riderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.rider = riderId;
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
};

// User Management
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { next(err); }
};

exports.blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.unblockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

// Review Moderation
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('user product');
    res.json(reviews);
  } catch (err) { next(err); }
};

exports.approveReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, { approved: true }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) { next(err); }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted' });
  } catch (err) { next(err); }
};

// Push Notifications (FCM)
exports.sendNotification = async (req, res, next) => {
  try {
    // Implement FCM push logic here
    // For demo, just log
    const { userId, title, message, type } = req.body;
    // Save notification in DB
    const notification = new Notification({ user: userId, title, message, type });
    await notification.save();
    // TODO: Send via FCM
    res.json({ message: 'Notification sent', notification });
  } catch (err) { next(err); }
};

// Analytics
exports.dashboardStats = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const revenueByCity = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: '$city', revenue: { $sum: '$totalAmount' } } },
    ]);
    const bestSelling = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalUsers,
      revenueByCity,
      bestSelling,
    });
  } catch (err) { next(err); }
};
