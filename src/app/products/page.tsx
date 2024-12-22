"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/lib/productApi';
import { Button } from "@/components/ui/button";
import { ProductGrid } from '@/components/ProductGrid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 12,
    inStock: ''
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getAllProducts(),
  });

  const handleEdit = (id: string) => {
    router.push(`/products/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    console.log("the id you did is", id);
  };

  const handlePurchase = (id: string) => {
    router.push(`/purchases/new?productId=${id}`);
  };

  const handleSale = (id: string) => {
    router.push(`/sales/new?productId=${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/products/new">Add New Product</Link>
        </Button>
      </div>



      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ProductGrid
            products={data?.products || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPurchase={handlePurchase}
            onSale={handleSale}
            onViewDetails={handleViewDetails}
          />
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            <span>Page {filters.page} of {data?.pagination.totalPages}</span>
            <Button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page === data?.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

