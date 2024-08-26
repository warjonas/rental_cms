import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    const { phone, firstName, lastName, imageUrl, position } = body;

    if (!firstName) {
      return new NextResponse('Product Name is required', { status: 400 });
    }
    if (!lastName) {
      return new NextResponse('Product Name is required', { status: 400 });
    }
    if (!position) {
      return new NextResponse('Product Name is required', { status: 400 });
    }
    if (!phone) {
      return new NextResponse('Product Name is required', { status: 400 });
    }

    if (!imageUrl) {
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

    const member = await prismadb.teamMembers.create({
      data: {
        id: phone,
        firstName,
        lastName,
        position,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.log('[TEAM_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const members = await prismadb.teamMembers.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.log('[TEAM_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
