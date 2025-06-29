// File: src/utils/generateTokens.js

const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

/**
 * Generate a JWT for a user.
 * @param payload - Object with userId, email, and role
 * @returns JWT token string
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
    issuer: 'financial-analytics-api',
    audience: 'financial-analytics-client',
  });
};

/**
 * Verify a JWT and return the decoded payload
 * @param token - JWT string
 * @returns Decoded JWT payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET, {
    issuer: 'financial-analytics-api',
    audience: 'financial-analytics-client',
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
