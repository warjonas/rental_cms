import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

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

    const { clientName, message } = body;

    if (!clientName) {
      return new NextResponse('Client Name is required', { status: 400 });
    }

    if (!message) {
      return new NextResponse('Message is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: parameters.storeId,
        users: {
          some: {
            userId: user?.id,
          },
        },
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const testimonial = await prismadb.testimonial.create({
      data: {
        clientName,
        message,
        storeId: parameters.storeId,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.log('[TESTIMONIAL_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const billboards = await prismadb.testimonial.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[TESTIMONIAL_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
