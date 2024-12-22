import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

interface DashboardSummary {
  todaySales: {
    count: number;
    total: number;
  };
  todayPurchases: {
    count: number;
    total: number;
  };
  lowStockProducts: number;
  totalProducts: number;
  totalCategories: number;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await axiosInstance.get('/dashboard/summary');
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};
