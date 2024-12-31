'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPurchase } from '@/lib/purchaseApi';
import { createProduct, getAllProducts } from '@/lib/productApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const purchaseItemSchema = z.object({
  productId: z.string().optional(),
  newProduct: z.object({
    name: z.string().min(1, "Product name is required"),
    buyingPrice: z.number().min(0, "Buying price must be positive"),
    sellingPrice: z.number().min(0, "Selling price must be positive"),
    categoryId: z.string().optional(),
    image: z.string().optional(),
    inStock: z.number().min(0, "In stock must be non-negative").optional(),
  }).optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

const purchaseSchema = z.object({
  items: z.array(purchaseItemSchema).min(1, "At least one item is required"),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export default function CreatePurchasePage() {
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    staleTime: 60000, // 1 minute
  });

  const products = productsData?.products || [];

  const { control, handleSubmit, watch, setValue } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      items: [{ quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const createPurchaseMutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success("Purchase created successfully");
    },
    onError: (error) => {
      console.error('Failed to create purchase:', error);
      toast.error("Failed to create purchase. Please try again.");
    },
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      return newProduct;
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
      toast.error("Failed to create new product. Please try again.");
    },
  });

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      const purchaseItems = await Promise.all(data.items.map(async (item) => {
        if (item.newProduct) {
          const newProduct = await createProductMutation.mutateAsync({
            ...item.newProduct,
            image: item.newProduct.image || '',
            inStock: item.newProduct.inStock || 0,
            categoryId: item.newProduct.categoryId || null,
          });
          return {
            productId: newProduct.id,
            quantity: item.quantity,
            price: item.price,
          };
        }
        return {
          productId: item.productId!,
          quantity: item.quantity,
          price: item.price,
        };
      }));

      await createPurchaseMutation.mutateAsync({ items: purchaseItems });
    } catch (error) {
      console.error('Failed to submit purchase:', error);
      toast.error("An error occurred while creating the purchase. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Item {index + 1}</h3>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`items.${index}.productId`}>Product</Label>
                    <Controller
                      name={`items.${index}.productId`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === 'new') {
                              setValue(`items.${index}.newProduct`, { name: '', buyingPrice: 0, sellingPrice: 0 });
                            } else {
                              setValue(`items.${index}.newProduct`, undefined);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingProducts ? (
                              <SelectItem value="loading" disabled>Loading products...</SelectItem>
                            ) : (
                              <>
                                {products.map((product: { id: string; name: string; }) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                                <SelectItem value="new">+ Create New Product</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`items.${index}.quantity`}>Quantity</Label>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`items.${index}.price`}>Price</Label>
                    <Controller
                      name={`items.${index}.price`}
                      control={control}
                      render={({ field }) => (
                        <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      )}
                    />
                  </div>
                </div>
                {watch(`items.${index}.productId`) === 'new' && (
                  <div className="space-y-4 mt-4 p-4 bg-muted rounded-md">
                    <h4 className="font-semibold">New Product Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`items.${index}.newProduct.name`}>Product Name</Label>
                        <Controller
                          name={`items.${index}.newProduct.name`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`items.${index}.newProduct.buyingPrice`}>Buying Price</Label>
                        <Controller
                          name={`items.${index}.newProduct.buyingPrice`}
                          control={control}
                          render={({ field }) => (
                            <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                          )}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`items.${index}.newProduct.sellingPrice`}>Selling Price</Label>
                        <Controller
                          name={`items.${index}.newProduct.sellingPrice`}
                          control={control}
                          render={({ field }) => (
                            <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ quantity: 1, price: 0 })}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <Button type="submit" className="w-full" disabled={createPurchaseMutation.isPending}>
              {createPurchaseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Purchase...
                </>
              ) : (
                'Create Purchase'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

