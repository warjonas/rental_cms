import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';
import { Product } from '@/types';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { quoteId: string } }
) {
  try {
    if (!params.quoteId) {
      return new NextResponse('Quote ID is required', { status: 400 });
    }

    const Quote = await prismadb.quote.findUnique({
      where: {
        id: params.quoteId,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(Quote);
  } catch (error) {
    console.log('[QUOTE_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { quoteId: string; storeId: string } }
) {
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

    const { values, products } = await req.json();
    const items = products.items;

    if (!products || products.length === 0) {
      return new NextResponse("Product's are required", { status: 400 });
    }

    if (!values.firstName) {
      return new NextResponse('First name is required', { status: 400 });
    }

    if (!values.lastName) {
      return new NextResponse('Last name is required', { status: 400 });
    }

    if (!values.idNumber) {
      return new NextResponse('ID Number is required', { status: 400 });
    }

    if (!values.emailAddress) {
      return new NextResponse('Email address is required', { status: 400 });
    }

    if (!values.phoneNumber) {
      return new NextResponse('Phone Number name is required', { status: 400 });
    }

    if (!values.deliveryAddressLine1) {
      return new NextResponse('Delivery Address Line 1 is required', {
        status: 400,
      });
    }

    if (!values.deliveryAddressCity) {
      return new NextResponse('Delivery City is required', { status: 400 });
    }

    if (!values.deliveryAddressSuburb) {
      return new NextResponse('Suburb is required', { status: 400 });
    }

    if (!values.deliveryPhoneNumber) {
      return new NextResponse('Delivery Phone number is required', {
        status: 400,
      });
    }

    if (!values.thirdPartyAddressLine1) {
      return new NextResponse('Third Party Address Line 1 is required', {
        status: 400,
      });
    }

    if (!values.thirdPartyAddressCity) {
      return new NextResponse('Third Party City is required', { status: 400 });
    }

    if (!values.thirdPartyAddressSuburb) {
      return new NextResponse('Third Party Suburb is required', {
        status: 400,
      });
    }

    if (!values.thirdPartyContactPerson) {
      return new NextResponse('Third Party Contact Person is required', {
        status: 400,
      });
    }

    if (!values.thirdPartyPhoneNumber) {
      return new NextResponse('Third Party Phone Number is required', {
        status: 400,
      });
    }
    if (!values.confirmationPayment) {
      return new NextResponse('Payment terms agreement is required', {
        status: 400,
      });
    }

    if (!values.confirmationTerms) {
      return new NextResponse('Terms and Conditions agreement is required', {
        status: 400,
      });
    }
    if (!params.quoteId) {
      return new NextResponse('Quote ID is required', { status: 400 });
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

    await prismadb.quote.update({
      where: {
        id: params.quoteId,
      },
      data: {
        storeId: params.storeId,
        isPaid: values.isPaid,
        totalPrice: values.totalPrice,
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.emailAddress,
        idNumber: values.idNumber,
        // eventDate: new Date(values.eventDate),
        phone: values.phoneNumber,
        deliveryAddressLine1: values.deliveryAddressLine1,
        deliveryAddressLine2: values.deliveryAddressLine2,
        deliveryAddressCity: values.deliveryAddressCity,
        deliveryAddressSuburb: values.deliveryAddressSuburb,
        deliveryPhoneNumber: values.deliveryPhoneNumber,
        thirdPartyAddressLine1: values.thirdPartyAddressLine1,
        thirdPartyAddressLine2: values.thirdPartyAddressLine2,
        thirdPartyAddressCity: values.thirdPartyAddressCity,
        thirdPartyAddressSuburb: values.thirdPartyAddressSuburb,
        thirdPartyPhoneNumber: values.thirdPartyPhoneNumber,
        thirdPartyContactPerson: values.thirdPartyContactPerson,
        confirmationPayment: values.confirmationPayment,
        confirmationTerms: values.confirmationTerms,
        orderItems: {
          deleteMany: {},
        },
      },
    });

    const quote = await prismadb.quote.update({
      where: {
        id: params.quoteId,
      },
      data: {
        orderItems: {
          create: items.map((item: Product) => ({
            unitPrice: item.unitPrice,
            qty: item.qty,

            product: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.log('[QUOTE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { quoteId: string; storeId: string } }
) {
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

    if (!params.quoteId) {
      return new NextResponse('Quote ID is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
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

    const Quote = await prismadb.quote.deleteMany({
      where: {
        id: params.quoteId,
      },
    });

    return NextResponse.json(Quote);
  } catch (error) {
    console.log('[QUOTE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
