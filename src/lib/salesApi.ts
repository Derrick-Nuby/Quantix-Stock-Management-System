import { Sale } from '@prisma/client';
import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

interface CreateSaleData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export const createSale = async (saleData: CreateSaleData): Promise<Sale> => {
  try {
    const response = await axiosInstance.post('/sales', saleData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const getSaleHistory = async (params?: { startDate?: string, endDate?: string, page?: number, limit?: number; }): Promise<{ sales: Sale[], total: number; }> => {
  try {
    const response = await axiosInstance.get('/sales', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

