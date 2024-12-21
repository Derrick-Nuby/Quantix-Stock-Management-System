import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, parentId } = body;

    const category = await prisma.category.create({
      data: {
        name,
        parentId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log("failed to create category", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("failed to fetch categories", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}