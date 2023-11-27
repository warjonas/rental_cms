import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';
import { QuoteItem } from '@prisma/client';
import { Product } from '@/types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { values, products } = await req.json();
  const items = products.items;

  if (!products || products.length === 0) {
    return new NextResponse("Product's are required", { status: 400 });
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
        Name: values.name,
        phone: values.phone,
        address: values.address,
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
    console.log('[QUOTE_POST]', error);
    return new NextResponse('Internal Error', { status: 400 });
  }
}
