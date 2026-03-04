import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  // 1. Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    // 2. You MUST return the locale here along with messages
    locale, 
    messages: (await import(`../messages/${locale}.json`)).default
  };
});