import { Purchase } from '@prisma/client';
import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

interface CreatePurchaseData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export const createPurchase = async (purchaseData: CreatePurchaseData): Promise<Purchase> => {
  try {
    const response = await axiosInstance.post('/purchases', purchaseData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const getPurchaseHistory = async (params?: { startDate?: string, endDate?: string, page?: number, limit?: number; }): Promise<{ purchases: Purchase[], total: number; }> => {
  try {
    const response = await axiosInstance.get('/purchases', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

