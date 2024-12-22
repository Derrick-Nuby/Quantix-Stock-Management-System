import { Product } from '@prisma/client';
import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  try {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const getAllProducts = async (params?: { category?: string, inStock?: boolean, page?: number, limit?: number; }): Promise<{ products: Product[], total: number; }> => {
  try {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const deleteProduct = async (id: string): Promise<{ message: string; }> => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

