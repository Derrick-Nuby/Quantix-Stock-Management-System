import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todaySales,
      todayPurchases,
      lowStockProducts,
      totalProducts,
      totalCategories,
    ] = await Promise.all([
      prisma.sale.aggregate({
        where: {
          date: {
            gte: today,
          },
        },
        _sum: {
          total: true,
        },
        _count: true,
      }),
      prisma.purchase.aggregate({
        where: {
          date: {
            gte: today,
          },
        },
        _sum: {
          total: true,
        },
        _count: true,
      }),
      prisma.product.count({
        where: {
          inStock: {
            lte: 10, // Assuming 10 is the low stock threshold
          },
        },
      }),
      prisma.product.count(),
      prisma.category.count(),
    ]);

    const summary = {
      todaySales: {
        count: todaySales._count,
        total: todaySales._sum.total || 0,
      },
      todayPurchases: {
        count: todayPurchases._count,
        total: todayPurchases._sum.total || 0,
      },
      lowStockProducts,
      totalProducts,
      totalCategories,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.log('failed to fetch summary', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}