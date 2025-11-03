/**
 * Payment Service
 */

import api from './api';
import type { Payment } from '../types';

export const paymentService = {
  /**
   * Get all payments with optional filters
   */
  getPayments: async (params?: {
    search?: string;
    invoice?: string;
  }): Promise<Payment[]> => {
    const response = await api.get<{ results: Payment[] }>('/payments/', { params });
    return response.data.results;
  },

  /**
   * Get a single payment by ID
   */
  getPayment: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}/`);
    return response.data;
  },

  /**
   * Record a new payment
   */
  createPayment: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post<Payment>('/payments/', data);
    return response.data;
  },

  /**
   * Update an existing payment
   */
  updatePayment: async (id: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await api.put<Payment>(`/payments/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a payment
   */
  deletePayment: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}/`);
  },
};
