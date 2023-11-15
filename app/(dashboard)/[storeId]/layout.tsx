import { getCurrentUser } from '@/actions/getCurrentUser';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Navbar from '@/components/Navbar';
import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = { children: React.ReactNode; params: { storeId: string } };

async function DashBoardLayout({ children, params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser(session?.user?.email);

  const store = await prismadb.userStore.findFirst({
    where: {
      storeId: params.storeId,
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
