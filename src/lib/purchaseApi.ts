import { Product, Purchase, PurchaseItem } from '@prisma/client';
import axiosInstance from './axiosConfig';
import { handleAxiosError } from '@/utils/errorHandler';

interface CreatePurchaseData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

type PurchaseWithItems = Purchase & {
  items: (PurchaseItem & {
    product: Product;
  })[];
};

interface PurchaseHistoryResponse {
  purchases: PurchaseWithItems[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PurchaseHistoryParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const createPurchase = async (purchaseData: CreatePurchaseData): Promise<Purchase> => {
  try {
    const response = await axiosInstance.post('/purchases', purchaseData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const getPurchaseHistory = async (params?: PurchaseHistoryParams): Promise<PurchaseHistoryResponse> => {
  try {
    const response = await axiosInstance.get<PurchaseHistoryResponse>('/purchases', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

