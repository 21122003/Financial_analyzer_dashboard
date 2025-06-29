// File: src/types/User.ts

import { Document } from 'mongoose';

export interface IUser extends Document {
 email: string;
 password: string;
 firstName: string;
 lastName: string;
 role: 'admin' | 'user';
 isActive?: boolean;
 lastLogin?: Date;
 createdAt?: Date;
 updatedAt?: Date;
}

export interface LoginRequest {
 email: string;
 password: string;
}

export interface LoginResponse {
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

export interface JWTPayload {
 userId: string;
 email: string;
 role: string;
}
// src/types/User.ts
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

