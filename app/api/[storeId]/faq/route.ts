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

    const { question, answer } = body;

    if (!question) {
      return new NextResponse('Question is required', { status: 400 });
    }

    if (!answer) {
      return new NextResponse('Answer is required', { status: 400 });
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

    const faq = await prismadb.fAQ.create({
      data: {
        question,
        answer,
        storeId: parameters.storeId,
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.log('[FAQ_POST]', error);
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

    const faqs = await prismadb.fAQ.findMany({
      where: {
        storeId: parameters.storeId,
      },
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.log('[FAQ_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
