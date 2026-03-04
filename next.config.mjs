import createNextIntlPlugin from 'next-intl/plugin';

// Using the explicit path with no extra spaces or dots
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure this is empty for a moment to test
};

export default withNextIntl(nextConfig);