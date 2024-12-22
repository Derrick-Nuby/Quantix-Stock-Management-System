import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

interface DailySalesReport {
  // Define the structure of your daily sales report here
  date: string;
  totalSales: number;
  // Add other relevant fields
}

export const getDailySalesReport = async (params: { date?: string, startDate?: string, endDate?: string, year?: number, month?: number; }): Promise<DailySalesReport> => {
  try {
    const response = await axiosInstance.get('/analytics', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

