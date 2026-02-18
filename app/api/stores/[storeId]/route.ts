import prismadb from '@/lib/prismadb';

import { NextResponse } from 'next/server';

import { auth } from '@/app/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const parameters = await params;
    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: parameters.storeId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
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

    const { name, logoUrl } = body;

    if (!user?.id) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: parameters.storeId,
        users: {
          some: {
            userId: user?.id,
          },
        },
      },
      data: {
        name,
        logoUrl,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const session = await auth();
    const parameters = await params;

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: parameters.storeId,
        users: {
          some: {
            userId: user?.id,
          },
        },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
