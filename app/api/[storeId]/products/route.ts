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

    const {
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
    if (!qty) {
      return new NextResponse('Product Quantity is required', { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse('At least 1 product image is required', {
        status: 400,
      });
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

    const category = await prismadb.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    const d = new Date();

    const prodId =
      category?.name.substring(0, 3).toUpperCase() +
      '-' +
      d.getMonth().toString() +
      d.getFullYear().toString() +
      '-' +
      d.getMinutes().toString() +
      d.getSeconds().toString();

    const product = await prismadb.product.create({
      data: {
        id: prodId,
        name,
        price,
        categoryId,
        colourId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isFeatured,
        isArchived,
        storeId: params.storeId,
        qty,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_POST]', error);
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
