import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { colourId: string } }
) {
  try {
    if (!params.colourId) {
      return new NextResponse('Colour ID is required', { status: 400 });
    }

    const colour = await prismadb.colour.findUnique({
      where: {
        id: params.colourId,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log('[COLOUR_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colourId: string; storeId: string } }
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

    const { name, value } = body;

    if (!name) {
      return new NextResponse('Size Name is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!params.colourId) {
      return new NextResponse('Colour ID is required', { status: 400 });
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

    const colour = await prismadb.colour.updateMany({
      where: {
        id: params.colourId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log('[COLOUR_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colourId: string; storeId: string } }
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

    if (!params.colourId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
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

    const colour = await prismadb.colour.deleteMany({
      where: {
        id: params.colourId,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log('[COLOUR_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
