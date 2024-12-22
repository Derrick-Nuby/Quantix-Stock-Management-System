import { Category } from '@prisma/client';
import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

export const createCategory = async (categoryData: { name: string, parentId?: string; }): Promise<Category> => {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

