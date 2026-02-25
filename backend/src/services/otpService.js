const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const OTP_EXPIRY_MINUTES = 10;

// In-memory store for demo (replace with Redis/DB in prod)
const otpStore = {};

async function sendOtp(email, isReset = false) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  otpStore[email + (isReset ? '_reset' : '')] = { otp, expires };
  // Send OTP via email (replace with production mailer)
  // For demo, just log
  console.log(`OTP for ${email}: ${otp}`);
  // Optionally, use nodemailer to send real email
}

async function verifyOtp(email, otp, isReset = false) {
  const key = email + (isReset ? '_reset' : '');
  const record = otpStore[key];
  if (!record) return false;
  if (record.otp !== otp) return false;
  if (Date.now() > record.expires) return false;
  delete otpStore[key];
  return true;
}

module.exports = { sendOtp, verifyOtp };
