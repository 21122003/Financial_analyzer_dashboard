// File: Loopr_Ai/project/backend/dist/controllers/authController.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
import { Request, Response } from 'express';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const errors = (0, express_validator_1.validationResult)(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }
      const { email, password } = req.body;
      const result = await authService_1.AuthService.login({ email, password });
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    }
    catch (error) {
      res.status(401).json({
        success: false,
        message: (error instanceof Error ? error.message : 'Login failed')
      });
    }
  },
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }
      const profile = await authService_1.AuthService.getUserProfile(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profile
      });
    }
    catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Profile not found'
      });
    }
  },
  async refreshToken(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }
      const user = await authService_1.AuthService.getUserProfile(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { user }
      });
    }
    catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed'
      });
    }
  },
  loginValidation: [
    (0, express_validator_1.body)('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]
};
//# sourceMappingURL=authController.js.map