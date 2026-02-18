import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    const parameters = await params;
    if (!params.productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: parameters.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        colour: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
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

    const {
      description,
      name,
      price,
      categoryId,
      colourId,
      sizeId,
      images,
      isFeatured,
      isArchived,
      qty,
    } = body;

    if (!name) {
      return new NextResponse('Product Name is required', { status: 400 });
    }

    if (!price) {
      return new NextResponse('Product Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Product Category is required', { status: 400 });
    }

    if (!colourId) {
      return new NextResponse('Product Colour is required', { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse('Product Size is required', { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse('At least 1 product image is required', {
        status: 400,
      });
    }

    if (!parameters.productId) {
      return new NextResponse('Product ID is required', { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: parameters.productId,
      },
      data: {
        description,
        name,
        price,
        categoryId,
        colourId,
        sizeId,
        images: {
          deleteMany: {
            // removing all images with initial update first
          },
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: parameters.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
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

    if (!params.productId) {
      return new NextResponse('Product ID is required', { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
