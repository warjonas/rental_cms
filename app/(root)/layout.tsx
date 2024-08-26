import prismadb from '@/lib/prismadb';

import { redirect } from 'next/navigation';
import React from 'react';

import { getCurrentUser } from '@/actions/getCurrentUser';
import { auth } from '../auth';

type Props = { children: React.ReactNode };

async function SetupLayout({ children }: Props) {
  const session = await auth();

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
