import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing'; // Use './' if both are in your root folder

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for static files and APIs
  matcher: ['/', '/(en|hi|ta|te|bn|mr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};