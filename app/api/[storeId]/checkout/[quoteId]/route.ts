import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';
import { Product } from '@/types';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { quoteId: string } }
) {
  try {
    if (!params.quoteId) {
      return new NextResponse('Quote ID is required', { status: 400 });
    }

    const Quote = await prismadb.quote.findUnique({
      where: {
        id: params.quoteId,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(Quote);
  } catch (error) {
    console.log('[QUOTE_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { quoteId: string; storeId: string } }
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

    const { values, products } = await req.json();
    const items = products.items;

    if (!values.name) {
      return new NextResponse('Quote Name is required', { status: 400 });
    }
    if (!values.address) {
      return new NextResponse('Quote Name is required', { status: 400 });
    }
    if (!values.phone) {
      return new NextResponse('Quote phone is required', { status: 400 });
    }
    if (!values.totalPrice) {
      return new NextResponse('Quote Name is required', { status: 400 });
    }
    if (!values.name) {
      return new NextResponse('Quote Name is required', { status: 400 });
    }

    if (!items || !items.length) {
      return new NextResponse('At least 1 Item is required', {
        status: 400,
      });
    }

    if (!params.quoteId) {
      return new NextResponse('Quote ID is required', { status: 400 });
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

    await prismadb.quote.update({
      where: {
        id: params.quoteId,
      },
      data: {
        storeId: params.storeId,
        isPaid: values.isPaid,
        totalPrice: values.totalPrice,
        Name: values.name,
        phone: values.phone,
        address: values.address,
        orderItems: {
          deleteMany: {},
        },
      },
    });

    const quote = await prismadb.quote.update({
      where: {
        id: params.quoteId,
      },
      data: {
        orderItems: {
          create: items.map((item: Product) => ({
            unitPrice: item.unitPrice,
            qty: item.qty,

            product: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.log('[QUOTE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { quoteId: string; storeId: string } }
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

    if (!params.quoteId) {
      return new NextResponse('Quote ID is required', { status: 400 });
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

    const Quote = await prismadb.quote.deleteMany({
      where: {
        id: params.quoteId,
      },
    });

    return NextResponse.json(Quote);
  } catch (error) {
    console.log('[QUOTE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
