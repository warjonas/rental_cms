import prismadb from '@/lib/prismadb';
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
  { params }: { params: Promise<{ customerId: string }> },
) {
  // Email is used as customerID in this function
  try {
    const parameters = await params;
    if (!parameters.customerId) {
      return new NextResponse('Email Address is required', { status: 400 });
    }

    const customer = await prismadb.customer.findUnique({
      where: {
        emailAddress: parameters.customerId,
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
  { params }: { params: Promise<{ customerId: string; storeId: string }> },
) {
  try {
    const paramaters = await params;
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

    if (!paramaters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!paramaters.customerId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.userStore.findFirst({
      where: {
        storeId: paramaters.storeId,
      },
    });

    if (!storeByUserId?.storeId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const customer = await prismadb.customer.updateMany({
      where: {
        emailAddress: paramaters.customerId,
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
  { params }: { params: Promise<{ customerId: string; storeId: string }> },
) {
  try {
    const parameters = await params;
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.email) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // const user = await prismadb.user.findUnique({
    //   where: {
    //     email: session?.user?.email,
    //   },
    // });

    if (!parameters.customerId) {
      return new NextResponse('Customer ID is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }
    const customerExist = await prismadb.customer.findFirst({
      where: {
        id: parameters.customerId,
      },
    });

    if (!customerExist) {
      return new NextResponse('Customer does not exist.', { status: 401 });
    }

    const storeByUserId = await prismadb.userStore.findFirst({
      where: {
        // userId: user?.id,
        storeId: parameters.storeId,
      },
    });

    if (!storeByUserId?.storeId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const customer = await prismadb.customer.deleteMany({
      where: {
        emailAddress: parameters.customerId,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log('[CUSTOMER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
