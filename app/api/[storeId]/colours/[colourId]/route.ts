import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ colourId: string }> },
) {
  try {
    const parameters = await params;
    if (!parameters.colourId) {
      return new NextResponse('Colour ID is required', { status: 400 });
    }

    const colour = await prismadb.colour.findUnique({
      where: {
        id: parameters.colourId,
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
  { params }: { params: Promise<{ colourId: string; storeId: string }> },
) {
  try {
    const parameters = await params;
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

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!parameters.colourId) {
      return new NextResponse('Colour ID is required', { status: 400 });
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

    const colour = await prismadb.colour.updateMany({
      where: {
        id: parameters.colourId,
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
  { params }: { params: Promise<{ colourId: string; storeId: string }> },
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

    if (!parameters.colourId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
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

    const colour = await prismadb.colour.deleteMany({
      where: {
        id: parameters.colourId,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log('[COLOUR_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
