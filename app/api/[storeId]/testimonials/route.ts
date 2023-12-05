import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

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

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
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

    const billboard = await prismadb.testimonial.create({
      data: {
        clientName,
        message,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[TESTIMONIAL_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
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
