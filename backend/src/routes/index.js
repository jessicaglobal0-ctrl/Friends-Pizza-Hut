const express = require('express');
const router = express.Router();


const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

const userRoutes = require('./userRoutes');
router.use('/user', userRoutes);

const adminRoutes = require('./adminRoutes');
router.use('/admin', adminRoutes);

const riderRoutes = require('./riderRoutes');
router.use('/rider', riderRoutes);

const paymentRoutes = require('./paymentRoutes');
router.use('/payment', paymentRoutes);

const realTimeRoutes = require('./realTimeRoutes');
router.use('/realtime', realTimeRoutes);

module.exports = router;
