/**
 * Authentication Service
 */

import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<{ access: string; refresh: string }> => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout/', { refresh_token: refreshToken });
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/user/');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<{ user: User; message: string }> => {
    const response = await api.patch('/auth/user/', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password/', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post('/auth/refresh/', { refresh: refreshToken });
    return response.data;
  },
};
