import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

interface DashboardSummary {
  // Define the structure of your dashboard summary here
  totalSales: number;
  totalPurchases: number;
  currentStock: number;
  totalProfit: number;
  // Add other relevant fields
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await axiosInstance.get('/dashboard/summary');
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

