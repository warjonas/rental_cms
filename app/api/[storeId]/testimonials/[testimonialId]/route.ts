import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ testimonialId: string }> },
) {
  try {
    const parameters = await params;
    if (!parameters.testimonialId) {
      return new NextResponse('testimonial ID is required', { status: 400 });
    }

    const testimonial = await prismadb.testimonial.findUnique({
      where: {
        id: parameters.testimonialId,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.log('[TESTIMONIAL_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ testimonialId: string; storeId: string }> },
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
    const { clientName, message } = body;

    if (!clientName) {
      return new NextResponse('clientName is required', { status: 400 });
    }

    if (!message) {
      return new NextResponse('Message is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!parameters.testimonialId) {
      return new NextResponse('Testmonial ID is required', { status: 400 });
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

    const testimonial = await prismadb.testimonial.updateMany({
      where: {
        id: parameters.testimonialId,
      },
      data: {
        clientName,
        message,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.log('[TESTIMONIAL_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ testimonialId: string; storeId: string }> },
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

    if (!parameters.testimonialId) {
      return new NextResponse('Testimonial ID is required', { status: 400 });
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

    const testimonial = await prismadb.testimonial.deleteMany({
      where: {
        id: parameters.testimonialId,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.log('[TESTIMONIAL_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
