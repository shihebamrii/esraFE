import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/lib/react-query";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bee Story Media Platform",
  description: "Premium Digital Media & Content",
};

import { notFound, redirect } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/settings';

import { PushNotificationProvider } from "@/providers/PushNotificationProvider";

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  // @ts-ignore
  if (!locales.includes(locale as any)) {
      // If the locale is not valid (e.g. 'login', 'admin'), redirect to default locale under that path
      // This is a failsafe if middleware misses it
      redirect(`/${defaultLocale}/${locale}`);
  }

  const messages = await getMessages();


  // Direction handling (RTL for Arabic)
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {/* Navbar imported dynamically or normally if client component */}
             <div className="flex min-h-screen flex-col">
              {/* @ts-ignore - Dynamic import might be cleaner but direct is fine for client boundary */}
              <NavbarWrapper />
              <MainLayoutContent>{children}</MainLayoutContent>
              <FooterWrapper />
            </div>
            <Toaster position="bottom-right" theme="dark" />
            <PushNotificationProvider />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
// Client wrappers to avoid importing client components directly if RootLayout is server
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainLayoutContent } from "@/components/layout/MainLayoutContent";

function NavbarWrapper() {
  return <Navbar />;
}
function FooterWrapper() {
  return <Footer />;
}
