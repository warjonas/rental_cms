import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Credentials': `${process.env.CORS_ALLOW_CREDENTIALS}`,
  'Access-Control-Allow-Origin': `${process.env.CORS_ALLOW_ORIGIN}`,
  'Access-Control-Allow-Methods': `${process.env.CORS_ALLOW_METHODS}`,
  'Access-Control-Allow-Headers': `${process.env.CORS_ALLOW_HEADERS}`,
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { customerId: string } }
) {
  // Email is used as customerID in this function
  try {
    if (!params.customerId) {
      return new NextResponse('Email Address is required', { status: 400 });
    }

    const customer = await prismadb.customer.findUnique({
      where: {
        emailAddress: params.customerId,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log('[CUSTOMER_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { customerId: string; storeId: string } }
) {
  try {
    const body = await req.json();
    const {
      phoneNumber,
      personalAddressLine1,
      personalAddressLine2,
      personalAddressCity,
      personalAddressSuburb,
      idNumber,
    } = body;

    if (!phoneNumber) {
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

    if (!params.customerId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.userStore.findFirst({
      where: {
        storeId: params.storeId,
      },
    });

    if (!storeByUserId?.storeId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const customer = await prismadb.customer.updateMany({
      where: {
        emailAddress: params.customerId,
      },
      data: {
        personalAddressCity,
        personalAddressLine1,
        personalAddressLine2,
        personalAddressSuburb,
        personalPhoneNumber: phoneNumber,
        idNumber,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log('[CUSTOMER_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { customerId: string; storeId: string } }
) {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.email) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // const user = await prismadb.user.findUnique({
    //   where: {
    //     email: session?.user?.email,
    //   },
    // });

    if (!params.customerId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.userStore.findFirst({
      where: {
        // userId: user?.id,
        storeId: params.storeId,
      },
    });

    if (!storeByUserId?.storeId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const customer = await prismadb.customer.deleteMany({
      where: {
        emailAddress: params.customerId,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log('[CUSTOMER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
