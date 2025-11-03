/**
 * Dashboard Service
 */

import api from './api';
import type { DashboardData } from '../types';

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/reports/dashboard/');
    return response.data;
  },
};
