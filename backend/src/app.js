require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Security headers
app.use(helmet());
// CORS
app.use(cors());
// Logging
app.use(morgan('dev'));
// Body parser
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// API routes
app.use('/api', routes);

// Central error handler
app.use(errorHandler);

module.exports = app;
