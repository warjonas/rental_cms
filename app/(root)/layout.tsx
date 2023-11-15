import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getCurrentUser } from '@/actions/getCurrentUser';

type Props = { children: React.ReactNode };

async function SetupLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser(session?.user?.email);

  const store = await prismadb.userStore.findFirst({
    where: {
      userId: user?.id,
    },
  });

  if (store) {
    redirect(`/${store.storeId}`);
  }

  return <>{children}</>;
}

export default SetupLayout;
