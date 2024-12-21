import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let queryStartDate: Date;
    let queryEndDate: Date;

    if (date) {
      queryStartDate = new Date(date);
      queryStartDate.setHours(0, 0, 0, 0);
      queryEndDate = new Date(queryStartDate);
      queryEndDate.setDate(queryEndDate.getDate() + 1);
    } else if (startDate && endDate) {
      queryStartDate = new Date(startDate);
      queryStartDate.setHours(0, 0, 0, 0);
      queryEndDate = new Date(endDate);
      queryEndDate.setHours(23, 59, 59, 999);
    } else if (year && month) {
      queryStartDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      queryEndDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
    } else {
      return NextResponse.json({ error: 'Invalid date parameters' }, { status: 400 });
    }

    const sales = await prisma.sale.findMany({
      where: {
        date: {
          gte: queryStartDate,
          lte: queryEndDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const summary = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((acc, sale) => acc + sale.total, 0),
      itemsSold: sales.reduce((acc, sale) => acc + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0),
      productPerformance: {} as {
        [key: string]: {
          name: string;
          quantitySold: number;
          revenue: number;
        };
      },
      periodStart: queryStartDate.toISOString(),
      periodEnd: queryEndDate.toISOString(),
    };

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!summary.productPerformance[item.productId]) {
          summary.productPerformance[item.productId] = {
            name: item.product.name,
            quantitySold: 0,
            revenue: 0,
          };
        }
        summary.productPerformance[item.productId].quantitySold += item.quantity;
        summary.productPerformance[item.productId].revenue += item.total;
      });
    });

    // Convert productPerformance to an array and sort by revenue
    const sortedProductPerformance = Object.entries(summary.productPerformance)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      ...summary,
      productPerformance: sortedProductPerformance,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}