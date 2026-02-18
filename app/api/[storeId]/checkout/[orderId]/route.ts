import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';
import { Product } from '@/types';
import { format } from 'date-fns';

import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const parameters = await params;
    if (!parameters.orderId) {
      return new NextResponse('Order ID is required', { status: 400 });
    }

    const Order = await prismadb.order.findUnique({
      where: {
        id: parameters.orderId,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(Order);
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string; storeId: string }> },
) {
  try {
    const parameters = await params;
    const session = await auth();

    const { values, products, customerId } = await req.json();
    const items = products.items;
    let user;

    if (!session?.user?.email || !customerId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session) {
      user = await prismadb.user.findUnique({
        where: {
          email: session?.user?.email,
        },
      });
    }

    if (!products || products.length === 0) {
      return new NextResponse("Product's are required", { status: 400 });
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
    if (!parameters.orderId) {
      return new NextResponse('Order ID is required', { status: 400 });
    }

    if (!parameters.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (session) {
      const storeByUserId = await prismadb.userStore.findFirst({
        where: {
          userId: user?.id,
          storeId: parameters.storeId,
        },
      });

      if (!storeByUserId?.storeId) {
        return new NextResponse('Unauthorized', { status: 403 });
      }
    }

    await prismadb.order.update({
      where: {
        id: parameters.orderId,
      },
      data: {
        storeId: parameters.storeId,
        isPaid: values.isPaid,
        totalPrice: values.totalPrice,
        customerId: customerId,
        // eventDate: new Date(values.eventDate),
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

    const order = await prismadb.order.update({
      where: {
        id: parameters.orderId,
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

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ orderId: string; storeId: string }> },
) {
  try {
    const session = await auth();
    const parameters = await params;

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    if (!parameters.orderId) {
      return new NextResponse('Order ID is required', { status: 400 });
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

    const Quote = await prismadb.order.deleteMany({
      where: {
        id: parameters.orderId,
      },
    });

    return NextResponse.json(Quote);
  } catch (error) {
    console.log('[ORDER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
