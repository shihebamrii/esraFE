import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http' as const,
        hostname: 'localhost',
      },
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https' as const,
        hostname: 'i1.pickpik.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'media.istockphoto.com',
      }
    ],
  },
};
 
export default withNextIntl(nextConfig);
