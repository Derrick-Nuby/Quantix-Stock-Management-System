import { Product, Sale, SaleItem } from '@prisma/client';
import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

export interface CreateSaleData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export type SaleWithItems = Sale & {
  items: (SaleItem & {
    product: Product;
  })[];
};

export interface SaleHistoryResponse {
  sales: SaleWithItems[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SaleHistoryParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const createSale = async (saleData: CreateSaleData): Promise<Sale> => {
  try {
    const response = await axiosInstance.post('/sales', saleData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const getSaleHistory = async (params?: SaleHistoryParams): Promise<SaleHistoryResponse> => {
  try {
    const response = await axiosInstance.get<SaleHistoryResponse>('/sales', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

