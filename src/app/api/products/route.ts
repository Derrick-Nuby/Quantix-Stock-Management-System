import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, image, buyingPrice, sellingPrice, categoryId, inStock } = body;

    const product = await prisma.product.create({
      data: {
        name,
        image,
        buyingPrice,
        sellingPrice,
        categoryId,
        inStock,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      AND: [
        { name: { contains: search, mode: 'insensitive' } },
        category ? { categoryId: category } : {},
        inStock === 'true' ? { inStock: { gt: 0 } } : {},
        minPrice ? { sellingPrice: { gte: parseFloat(minPrice) } } : {},
        maxPrice ? { sellingPrice: { lte: parseFloat(maxPrice) } } : {},
      ],
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          category: true,
          sales: {
            take: 1,
            orderBy: {
              sale: {
                date: 'desc'
              }
            },
            include: {
              sale: true
            }
          }
        },
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      products: products.map(product => ({
        ...product,
        lastSold: product.sales[0]?.sale.date || null,
        sales: undefined // Remove sales array from response
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products'
    }, { status: 500 });
  }
}