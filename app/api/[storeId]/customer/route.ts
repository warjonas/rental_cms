import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const corsHeaders = {
  'Access-Control-Allow-Credentials': `${process.env.CORS_ALLOW_CREDENTIALS}`,
  'Access-Control-Allow-Origin': `${process.env.CORS_ALLOW_ORIGIN}`,
  'Access-Control-Allow-Methods': `${process.env.CORS_ALLOW_METHODS}`,
  'Access-Control-Allow-Headers': `${process.env.CORS_ALLOW_HEADERS}`,
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const parameters = await params;
    const body = await req.json();

    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      personalAddressLine1,
      personalAddressLine2,
      personalAddressCity,
      personalAddressSuburb,
      idNumber,
    } = body;

    if (!email) {
      return new NextResponse('Email is required', { status: 400 });
    }
    const exist = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (exist) {
      throw new Error('Email already exists');
    }

    if (!firstName) {
      return new NextResponse('First Name is required', { status: 400 });
    }

    if (!lastName) {
      return new NextResponse('Last Name is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store Id Is required', { status: 400 });
    }

    const customer = await prismadb.customer.create({
      data: {
        storeId: parameters.storeId,
        firstName,
        lastName,
        idNumber,
        lastLoggedIn: new Date(),
        personalAddressCity,
        personalAddressLine1,
        personalAddressLine2,
        personalAddressSuburb,
        personalPhoneNumber: phoneNumber,

        emailAddress: email,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log('[CUSTOMER_POST]', error);
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

    const customers = await prismadb.customer.findMany({
      where: {
        storeId: parameters.storeId,
      },
      orderBy: {},
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.log('[CUSTOMERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
