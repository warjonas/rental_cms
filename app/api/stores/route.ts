import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth';

import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
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

    const { name, logoUrl } = body;

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        logoUrl,
        users: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
