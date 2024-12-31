import { useState } from 'react';
import Image from 'next/image';
import { MoreVertical, Edit, Trash2, ShoppingCart, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from '@prisma/client';
import Link from 'next/link';

interface ProductCardProps extends Product {
  onEdit: () => void;
  onDelete: () => void;
  onPurchase: () => void;
  onSale: () => void;
  onViewDetails: () => void;
}

export function ProductCard({
  id,
  image,
  name,
  sellingPrice,
  onEdit,
  onDelete,
  onPurchase,
  onSale,
  onViewDetails
}: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card className="w-full">
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={`data:image/jpeg;base64,${image}`}
            alt={name}
            layout="fill"
            objectFit="cover"
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">Loading...</span>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPurchase}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Purchase</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSale}>
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Sale</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={`/products/${id}`} className="font-semibold text-lg">{name}</Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-xl font-bold">Rwf {sellingPrice.toFixed(2)}</span>
      </CardFooter>
    </Card>
  );
}

