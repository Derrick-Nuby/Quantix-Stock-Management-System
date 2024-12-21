import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    const sale = await prisma.sale.create({
      data: {
        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        total: items.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                buyingPrice: true,
                sellingPrice: true,
                inStock: true,
                category: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          inStock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.log('failed to create sale', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                buyingPrice: true,
                sellingPrice: true,
                inStock: true,
                category: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.sale.count({ where });

    return NextResponse.json({
      sales,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log('failed to fetch sales', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}