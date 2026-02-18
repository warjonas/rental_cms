import prismadb from '@/lib/prismadb';

import { NextResponse } from 'next/server';

import { auth } from '@/app/auth';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const session = await auth();
    const parameters = await params;

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    const body = await req.json();

    const { name, billboardId, coverPhotoUrl } = body;

    if (!name) {
      return new NextResponse('Billboard Name is required', { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse('Billbaord is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.userStore.findFirst({
      where: {
        userId: user?.id,
        storeId: parameters.storeId,
      },
    });

    if (!storeByUserId?.storeId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }
    const category = await prismadb.category.create({
      data: {
        coverPhotoUrl,
        name,
        billboardId,
        storeId: parameters.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATERGORIES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const parameters = await params;
    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: parameters.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
