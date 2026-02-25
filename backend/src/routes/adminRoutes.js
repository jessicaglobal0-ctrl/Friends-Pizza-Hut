const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require admin role
router.use(auth('admin'));

// Product management
router.post('/products', adminController.addProduct);
router.put('/products/:productId', adminController.editProduct);
router.delete('/products/:productId', adminController.deleteProduct);
router.patch('/products/:productId/toggle', adminController.toggleProductAvailability);

// Category management
router.post('/categories', adminController.addCategory);
router.put('/categories/:categoryId', adminController.editCategory);
router.delete('/categories/:categoryId', adminController.deleteCategory);

// City management
router.post('/cities', adminController.addCity);
router.put('/cities/:cityId', adminController.editCity);
router.delete('/cities/:cityId', adminController.deleteCity);

// Order management
router.get('/orders', adminController.getOrders);
router.patch('/orders/:orderId/status', adminController.updateOrderStatus);
router.patch('/orders/:orderId/assign', adminController.assignRider);

// User management
router.get('/users', adminController.getUsers);
router.patch('/users/:userId/block', adminController.blockUser);
router.patch('/users/:userId/unblock', adminController.unblockUser);

// Review moderation
router.get('/reviews', adminController.getReviews);
router.patch('/reviews/:reviewId/approve', adminController.approveReview);
router.delete('/reviews/:reviewId', adminController.deleteReview);

// Push notifications
router.post('/notifications', adminController.sendNotification);

// Analytics
router.get('/dashboard', adminController.dashboardStats);

module.exports = router;
