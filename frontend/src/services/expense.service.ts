/**
 * Expense Service
 */

import api from './api';
import type { Expense } from '../types';

export const expenseService = {
  /**
   * Get all expenses with optional filters
   */
  getExpenses: async (params?: {
    search?: string;
    category?: string;
  }): Promise<Expense[]> => {
    const response = await api.get<{ results: Expense[] }>('/expenses/', { params });
    return response.data.results;
  },

  /**
   * Get a single expense by ID
   */
  getExpense: async (id: string): Promise<Expense> => {
    const response = await api.get<Expense>(`/expenses/${id}/`);
    return response.data;
  },

  /**
   * Create a new expense
   */
  createExpense: async (data: FormData): Promise<Expense> => {
    const response = await api.post<Expense>('/expenses/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update an existing expense
   */
  updateExpense: async (id: string, data: FormData): Promise<Expense> => {
    const response = await api.put<Expense>(`/expenses/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete an expense
   */
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}/`);
  },
};
