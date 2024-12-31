'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createProduct } from '@/lib/productApi';
import { getCategories, createCategory } from '@/lib/categoryApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  image: z.string().min(1, "Image is required"),
  buyingPrice: z.number().min(0, "Buying price must be positive"),
  sellingPrice: z.number().min(0, "Selling price must be positive"),
  inStock: z.number().int().min(0, "In stock must be a non-negative integer"),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState('');

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      image: '',
      buyingPrice: 0,
      sellingPrice: 0,
      inStock: 0,
      categoryId: '',
    },
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
      toast.error("Failed to create product. Please try again.");
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category created successfully");
      return newCategory;
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
      toast.error("Failed to create category. Please try again.");
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (data.categoryId === 'new' && newCategory) {
        const createdCategory = await createCategoryMutation.mutateAsync({ name: newCategory });
        data.categoryId = createdCategory.id;
      }
      await createProductMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to submit product:', error);
      toast.error("An error occurred while creating the product. Please try again.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="image">Product Image</Label>
              <Input type="file" onChange={handleImageUpload} accept="image/*" />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>

            <div>
              <Label htmlFor="buyingPrice">Buying Price</Label>
              <Controller
                name="buyingPrice"
                control={control}
                render={({ field }) => <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />}
              />
              {errors.buyingPrice && <p className="text-red-500 text-sm mt-1">{errors.buyingPrice.message}</p>}
            </div>

            <div>
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Controller
                name="sellingPrice"
                control={control}
                render={({ field }) => <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />}
              />
              {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice.message}</p>}
            </div>

            <div>
              <Label htmlFor="inStock">In Stock</Label>
              <Controller
                name="inStock"
                control={control}
                render={({ field }) => <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />}
              />
              {errors.inStock && <p className="text-red-500 text-sm mt-1">{errors.inStock.message}</p>}
            </div>

            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCategories ? (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      ) : (
                        <>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">+ Create New Category</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
            </div>

            {control._formValues.categoryId === 'new' && (
              <div>
                <Label htmlFor="newCategory">New Category Name</Label>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

