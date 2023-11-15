'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import React from 'react';

type Props = {};

export const SignOutBtn = (props: Props) => {
  return (
    <div
      className="flex flex-row hover:cursor-pointer"
      onClick={() => signOut()}
    >
      <LogOutIcon className="h-5 w-5" />
    </div>
  );
};
