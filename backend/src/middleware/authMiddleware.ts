import { Request, Response, NextFunction } from 'express';
import {verifyToken} from '../utils/generateTokens';
import { User } from '../models/User';
import type { IUser } from '../models/User';

// 🔐 Extend Express types to support `req.user`
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}

// ✅ Middleware to authenticate JWT tokens
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId) as (IUser & { _id: any, email: string, role: string, isActive: boolean }) | null;
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    } else {
      return res.status(500).json({ success: false, message: 'Authentication error' });
    }
  }
};

// ✅ Middleware to restrict access based on roles
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};
