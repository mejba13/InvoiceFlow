/**
 * Invoice Service
 */

import api from './api';
import type { Invoice } from '../types';

export const invoiceService = {
  /**
   * Get all invoices with optional filters
   */
  getInvoices: async (params?: {
    search?: string;
    status?: string;
    client?: string;
  }): Promise<Invoice[]> => {
    const response = await api.get<{ results: Invoice[] }>('/invoices/', { params });
    return response.data.results;
  },

  /**
   * Get a single invoice by ID
   */
  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}/`);
    return response.data;
  },

  /**
   * Create a new invoice
   */
  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.post<Invoice>('/invoices/', data);
    return response.data;
  },

  /**
   * Update an existing invoice
   */
  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoices/${id}/`, data);
    return response.data;
  },

  /**
   * Delete an invoice
   */
  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}/`);
  },

  /**
   * Send invoice via email
   */
  sendInvoice: async (id: string): Promise<void> => {
    await api.post(`/invoices/${id}/send/`);
  },

  /**
   * Download invoice PDF
   */
  downloadInvoice: async (id: string): Promise<Blob> => {
    const response = await api.get(`/invoices/${id}/pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Mark invoice as paid
   */
  markAsPaid: async (id: string): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/invoices/${id}/mark_paid/`);
    return response.data;
  },
};
