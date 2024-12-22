import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ id: string; }>;

export async function GET(request: NextRequest, { params }: { params: Params; }) {
  try {

    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: {
        category: true,
        sales: {
          include: { sale: true },
          orderBy: { sale: { date: 'desc' } },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params; }) {
  try {

    const resolvedParams = await params;
    const body = await request.json();
    const { name, image, buyingPrice, sellingPrice, categoryId, inStock } = body;

    const product = await prisma.product.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        image,
        buyingPrice,
        sellingPrice,
        categoryId,
        inStock,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params; }) {
  try {

    const resolvedParams = await params;
    await prisma.product.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}