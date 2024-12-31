'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProduct } from '@/lib/productApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, Category, Sale, SaleItem } from '@prisma/client';

type ProductWithRelations = Product & {
  category: Category | null;
  sales: (SaleItem & { sale: Sale; })[];
};

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useQuery<ProductWithRelations, Error>({
    queryKey: ['product', id],
    queryFn: () => getProduct(id as string),
  });

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading product</div>;
  }

  if (!product) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Image
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="space-y-4">
            <p><span className="font-semibold">Category:</span> {product.category?.name || 'Uncategorized'}</p>
            <p><span className="font-semibold">Buying Price:</span> Rwf{product.buyingPrice.toFixed(2)}</p>
            <p><span className="font-semibold">Selling Price:</span> Rwf{product.sellingPrice.toFixed(2)}</p>
            <p><span className="font-semibold">In Stock:</span> {product.inStock}</p>
            <Badge variant={product.inStock > 0 ? "default" : "destructive"}>
              {product.inStock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.sales.map((saleItem) => (
                <TableRow key={saleItem.id}>
                  <TableCell>{new Date(saleItem.sale.date).toLocaleDateString()}</TableCell>
                  <TableCell>{saleItem.quantity}</TableCell>
                  <TableCell>Rwf{saleItem.price.toFixed(2)}</TableCell>
                  <TableCell>Rwf{saleItem.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

