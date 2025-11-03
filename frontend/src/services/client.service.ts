/**
 * Client Service
 */

import api from './api';
import type { Client } from '../types';

export const clientService = {
  /**
   * Get all clients with optional search
   */
  getClients: async (search?: string): Promise<Client[]> => {
    const params = search ? { search } : {};
    const response = await api.get<{ results: Client[] }>('/clients/', { params });
    return response.data.results;
  },

  /**
   * Get a single client by ID
   */
  getClient: async (id: string): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}/`);
    return response.data;
  },

  /**
   * Create a new client
   */
  createClient: async (data: Partial<Client>): Promise<Client> => {
    const response = await api.post<Client>('/clients/', data);
    return response.data;
  },

  /**
   * Update an existing client
   */
  updateClient: async (id: string, data: Partial<Client>): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a client
   */
  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}/`);
  },
};
