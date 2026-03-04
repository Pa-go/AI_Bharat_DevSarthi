import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import './globals.css';
import '../../styles/cyberpunk.css';

export default async function LocaleLayout({ children, params }) {
  // Await params to get the current locale
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        {/* This Provider is what the error "No intl context found" is looking for */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}