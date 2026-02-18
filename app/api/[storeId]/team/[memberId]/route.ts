import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  try {
    const parameters = await params;
    if (!parameters.memberId) {
      return new NextResponse('Member ID is required', { status: 400 });
    }

    const product = await prismadb.teamMembers.findUnique({
      where: {
        id: parameters.memberId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('MEMBER_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string; storeId: string }> },
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

    const { firstName, lastName, position, imageUrl } = body;

    if (!firstName) {
      return new NextResponse('First Name is required', { status: 400 });
    }

    if (!lastName) {
      return new NextResponse('Last Price is required', { status: 400 });
    }

    if (!position) {
      return new NextResponse('Postion is required', { status: 400 });
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

    const member = await prismadb.teamMembers.update({
      where: {
        id: parameters.memberId,
        storeId: parameters.storeId,
      },
      data: {
        firstName,
        lastName,
        imageUrl,
        position,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.log('[MEMBER_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberId: string; storeId: string }> },
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

    if (!parameters.memberId) {
      return new NextResponse('Member ID is required', { status: 400 });
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

    await prismadb.teamMembers.delete({
      where: {
        id: parameters.memberId,
      },
    });

    return NextResponse.json('Successfully Removed Team Member');
  } catch (error) {
    console.log('[MEMBER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
