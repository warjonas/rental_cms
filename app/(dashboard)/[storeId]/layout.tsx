import { getCurrentUser } from '@/actions/getCurrentUser';

import { auth } from '@/app/auth';
import Navbar from '@/components/Navbar';
import prismadb from '@/lib/prismadb';

import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
};

async function DashBoardLayout({ children, params }: Props) {
  const session = await auth();
  const { storeId } = await params;

  if (!session?.user?.email) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser(session?.user?.email);

  const store = await prismadb.userStore.findFirst({
    where: {
      storeId: storeId,
      userId: user?.id,
    },
  });

  if (!store?.storeId) {
    redirect('/');
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default DashBoardLayout;
