const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Joi = require('joi');
const { sendOtp, verifyOtp } = require('../services/otpService');
const { generateTokens, setRefreshTokenCookie } = require('../utils/tokenUtils');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  city: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

// Registration
exports.register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { name, email, password, phone, city } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed, phone, city });
    await user.save();
    await sendOtp(email);
    res.status(201).json({ message: 'Registered. Please verify OTP sent to email.' });
  } catch (err) { next(err); }
};

// OTP Verification
exports.verifyOtp = async (req, res, next) => {
  try {
    const { error } = otpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { email, otp } = req.body;
    const valid = await verifyOtp(email, otp);
    if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });
    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Email verified. You can now login.' });
  } catch (err) { next(err); }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(401).json({ message: 'Invalid credentials or not verified' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const tokens = generateTokens(user);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

// Refresh Token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ message: 'Invalid refresh token' });
    const tokens = generateTokens(user);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken });
  } catch (err) { next(err); }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(payload.id, { refreshToken: null });
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
};

// Google OAuth
exports.googleOAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        profileImage: payload.picture,
        isVerified: true,
        googleId: payload.sub,
      });
      await user.save();
    }
    const tokens = generateTokens(user);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

// Facebook OAuth
exports.facebookOAuth = async (req, res, next) => {
  try {
    const { accessToken, userID } = req.body;
    const fbRes = await fetch(`https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`);
    const fbData = await fbRes.json();
    if (!fbData.email) return res.status(400).json({ message: 'Facebook email not found' });
    let user = await User.findOne({ email: fbData.email });
    if (!user) {
      user = new User({
        name: fbData.name,
        email: fbData.email,
        profileImage: fbData.picture?.data?.url,
        isVerified: true,
        facebookId: fbData.id,
      });
      await user.save();
    }
    const tokens = generateTokens(user);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

// Password Reset Request
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await sendOtp(email, true); // true = password reset
    res.json({ message: 'OTP sent for password reset' });
  } catch (err) { next(err); }
};

// Password Reset
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const valid = await verifyOtp(email, otp, true);
    if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });
    res.json({ message: 'Password reset successful' });
  } catch (err) { next(err); }
};
