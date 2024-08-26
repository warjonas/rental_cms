import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ModalProvider } from '@/providers/modal-provider';

import './globals.css';
import prismadb from '@/lib/prismadb';
import { ToasterProvider } from '@/providers/toast-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import AuthProvider from '@/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skywalker Software CMS',
  description: 'Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
