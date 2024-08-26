import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';

import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    const body = await req.json();

    const { name, accountType, branchCode, accountNo } = body;

    if (!name) {
      return new NextResponse('Bank Name is required', { status: 400 });
    }

    if (!accountType) {
      return new NextResponse('Account Type is required', { status: 400 });
    }

    if (!branchCode) {
      return new NextResponse('Branch Code is required', { status: 400 });
    }

    if (!accountNo) {
      return new NextResponse('Account Number is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.userStore.findFirst({
      where: {
        userId: user?.id,
        storeId: params.storeId,
      },
    });

    if (!storeByUserId?.storeId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const bank = await prismadb.storeBank.create({
      data: {
        name,
        accountType,
        branchCode,
        accountNo,
        store: {
          connect: {
            id: params.storeId,
          },
        },
      },
      include: {
        store: true,
      },
    });

    return NextResponse.json(bank);
  } catch (error) {
    console.log('[BANK_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colourId = searchParams.get('colourId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured') || undefined;

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colourId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        colour: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
