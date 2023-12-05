import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

import { Product } from '@/types';

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
  { params }: { params: { storeId: string } }
) {
  const { values, products } = await req.json();
  const items = products;

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
    return new NextResponse('Third Party Suburb is required', { status: 400 });
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

  const d = new Date();

  const quoteId =
    'INV-' +
    d.getMonth().toString() +
    d.getFullYear().toString() +
    '-' +
    d.getMinutes().toString() +
    d.getSeconds().toString();

  try {
    const quote = await prismadb.quote.create({
      data: {
        id: quoteId,
        storeId: params.storeId,
        isPaid: values.isPaid,
        totalPrice: values.totalPrice,
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.emailAddress,
        idNumber: values.idNumber,
        eventDate: new Date(values.eventDate),

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
    return NextResponse.json({ quote, status: 200 });
  } catch (error) {
    console.log('[QUOTE_POST]', error);
    return new NextResponse('Internal Error', { status: 400 });
  }
}
