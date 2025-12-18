import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import '../globals.css';
import { cn } from '@/lib/utils';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AppModeProvider } from '@/context/AppModeContext';


const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-kr'
});

export const metadata: Metadata = {
  title: 'Consultation App',
  description: 'Dermatology consultation system',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={cn(notoSansKr.className, "antialiased min-h-screen bg-slate-50")} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AppModeProvider>
            {children}
          </AppModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
