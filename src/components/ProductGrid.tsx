'use client';

import { ProductCard } from './ProductCard';
import { Product } from '@prisma/client';

interface ProductGridProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPurchase: (id: string) => void;
  onSale: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function ProductGrid({
  products,
  onEdit,
  onDelete,
  onPurchase,
  onSale,
  onViewDetails
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onEdit={onEdit}
          onDelete={onDelete}
          onPurchase={onPurchase}
          onSale={onSale}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

