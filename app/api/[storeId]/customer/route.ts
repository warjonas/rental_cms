import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    const {
      email,
      hashedPassword,
      firstName,
      lastName,
      phone,
      personalAddressLine1,
      personalAddressLine2,
      personalAddressCity,
      personalAddressSuburb,
      idNumber,
    } = body;

    const exist = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (exist) {
      throw new Error('Email already exists');
    }

    if (!email) {
      return new NextResponse('Email is required', { status: 400 });
    }

    if (!hashedPassword) {
      return new NextResponse('Password is required', { status: 400 });
    }

    if (!firstName) {
      return new NextResponse('First Name is required', { status: 400 });
    }

    if (!lastName) {
      return new NextResponse('Last Name is required', { status: 400 });
    }

    if (!phone) {
      return new NextResponse('Phone Number is required', { status: 400 });
    }

    if (!idNumber) {
      return new NextResponse('ID Number is required', { status: 400 });
    }

    if (!personalAddressLine1) {
      return new NextResponse('Address Line 1 is required', { status: 400 });
    }

    if (!personalAddressCity) {
      return new NextResponse('City is required', { status: 400 });
    }

    if (!personalAddressSuburb) {
      return new NextResponse('Suburb is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const customer = await prismadb.customer.create({
      data: {
        firstName,
        lastName,
        hashedPassword,
        personalAddressCity,
        personalAddressLine1,
        personalAddressLine2,
        personalAddressSuburb,
        personalPhoneNumber: phone,
        idNumber,
        emailAddress: email,
        storeId: params.storeId,
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
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const customers = await prismadb.customer.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.log('[CUSTOMERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
