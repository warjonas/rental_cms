import { auth, signIn } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const session = await auth();

    const { firstName, lastName, email, password, role } = data;

    const user = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (user?.id) {
      return new NextResponse('Account already exists. Sign In instead.', {
        status: 401,
      });
    }

    if (!firstName) {
      return new NextResponse('FIrst Name is required', { status: 400 });
    }

    if (!password) {
      return new NextResponse('Password is required', { status: 400 });
    }

    if (!lastName) {
      return new NextResponse('Last Name is required', { status: 400 });
    }

    if (!email) {
      return new NextResponse('Email Address is required', { status: 400 });
    }

    if (!role) {
      return new NextResponse('Role is required', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prismadb.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
        role,
      },
    });

    await signIn('credentials', {
      ...data,
      redirect: false,
    });

    return NextResponse.json('Success!');
  } catch (error) {
    console.log('[REGISTER_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
