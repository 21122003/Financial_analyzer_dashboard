// File: src/services/authService.ts

import { User } from '../models/User';
import { IUser } from '../types/User';
import { generateToken } from '../utils/generateTokens';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
  };
  token: string;
}

export class AuthService {
  // ✅ Login handler
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt?.toISOString() ?? new Date().toISOString()
      },
      token
    };
  }

  // ✅ Get logged-in user's profile
  static async getUserProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found');
    }

    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as IUser;
  }

  // ✅ Create/register a new user
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = new User(userData);
    await user.save();

    return user;
  }
}
