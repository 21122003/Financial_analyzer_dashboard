// File: src/features/auth/authService.ts

import api from '../../services/api';
import { LoginCredentials, LoginResponse, User } from '../../types/User';

export const authService = {
 // Login user
 login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Mock API call - replace with actual API endpoint
  return new Promise((resolve, reject) => {
   setTimeout(() => {
    if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
     resolve({
      user: {
       id: '1',
       email: 'admin@example.com',
       firstName: 'Admin',
       lastName: 'User',
       role: 'admin',
       createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token-12345',
     });
    } else {
     reject(new Error('Invalid credentials'));
    }
   }, 1000);
  });
 },

 // Get current user profile
 getProfile: async (): Promise<User> => {
  const response = await api.get('/auth/profile');
  return response.data;
 },

 // Refresh token
 refreshToken: async (): Promise<string> => {
  const response = await api.post('/auth/refresh');
  return response.data.token;
 },
};
	