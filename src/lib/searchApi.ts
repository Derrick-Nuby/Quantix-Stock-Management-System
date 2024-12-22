import { Product } from '@prisma/client';
import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

export const searchProducts = async (params: { q: string, category?: string, minPrice?: number, maxPrice?: number; }): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get('/search/products', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

