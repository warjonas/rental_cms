import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
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
      return new NextResponse('Colour Name is required', { status: 400 });
    }

    if (!value) {
      return new NextResponse('Colour Value is required', { status: 400 });
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

    const colour = await prismadb.colour.create({
      data: {
        name,
        value,
        storeId: parameters.storeId,
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log('[COLOUR_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const parameters = await params;
    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const colours = await prismadb.colour.findMany({
      where: {
        storeId: parameters.storeId,
      },
    });

    return NextResponse.json(colours);
  } catch (error) {
    console.log('[COLOURS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
