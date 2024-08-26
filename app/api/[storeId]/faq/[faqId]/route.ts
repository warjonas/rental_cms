import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { faqId: string } }
) {
  try {
    if (!params.faqId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    const faq = await prismadb.fAQ.findUnique({
      where: {
        id: params.faqId,
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { faqId: string; storeId: string } }
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
    const { question, answer } = body;

    if (!question) {
      return new NextResponse('Question is required', { status: 400 });
    }

    if (!answer) {
      return new NextResponse('Answer is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!params.faqId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
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

    const faq = await prismadb.fAQ.updateMany({
      where: {
        id: params.faqId,
      },
      data: {
        question,
        answer,
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.log('[FAQ_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { faqId: string; storeId: string } }
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

    if (!params.faqId) {
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

    const faq = await prismadb.fAQ.deleteMany({
      where: {
        id: params.faqId,
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.log('[FAQ_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
