import { handleAxiosError } from "@/utils/errorHandler";
import axiosInstance from "./axiosConfig";

interface ProductPerformance {
  id: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

interface AnalyticsReport {
  totalSales: number;
  totalRevenue: number;
  itemsSold: number;
  productPerformance: ProductPerformance[];
  periodStart: string;
  periodEnd: string;
}

export const getAnalyticsReport = async (params: {
  date?: string,
  startDate?: string,
  endDate?: string,
  year?: number,
  month?: number;
}): Promise<AnalyticsReport> => {
  try {
    const response = await axiosInstance.get('/analytics', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};