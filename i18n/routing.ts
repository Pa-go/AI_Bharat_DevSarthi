import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation'; // Changed from createSharedPathnamesNavigation

export const routing = defineRouting({
  locales: ['en', 'hi', 'ta', 'te', 'bn', 'mr'], // Your supported languages
  defaultLocale: 'en' // English by default
});

// Use createNavigation instead
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);