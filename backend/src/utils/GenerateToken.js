// File: src/utils/generateTokens.ts

import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types/User';

/**
 * Generate a JWT for a user.
 * @param payload - Object with userId, email, and role
 * @returns JWT token string
 */
export const generateToken = (payload) => {
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
export const verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET, {
    issuer: 'financial-analytics-api',
    audience: 'financial-analytics-client',
  });
};
