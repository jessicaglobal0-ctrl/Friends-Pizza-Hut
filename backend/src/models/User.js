const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  postalCode: String,
  label: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'user', 'rider'], default: 'user' },
  profileImage: String,
  phone: String,
  city: String,
  addresses: [addressSchema],
  isVerified: { type: Boolean, default: false },
  googleId: String,
  facebookId: String,
  otp: String,
  otpExpires: Date,
  refreshToken: String,
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
