import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'Invalid input: products must be a non-empty array' }, { status: 400 });
    }

    const createdProducts = await prisma.product.createMany({
      data: products.map(product => ({
        name: product.name,
        image: product.image,
        buyingPrice: product.buyingPrice,
        sellingPrice: product.sellingPrice,
        categoryId: product.categoryId,
        inStock: product.inStock,
      })),
      skipDuplicates: true, // This will skip inserting any products that would cause a unique constraint violation
    });

    return NextResponse.json({
      message: `Successfully created ${createdProducts.count} products`,
      count: createdProducts.count
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create products in bulk:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}