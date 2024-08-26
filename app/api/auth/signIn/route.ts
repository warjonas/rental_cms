import { auth, signIn } from '@/app/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await signIn('credentials', {
      ...data,
      redirect: false,
    });

    return NextResponse.json('Success!');
  } catch (error) {
    console.log('[SIGNIN_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
