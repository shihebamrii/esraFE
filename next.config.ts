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
      },
      {
        protocol: 'https' as const,
        hostname: 'travel.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'idwey.tn',
      },
      {
        protocol: 'https' as const,
        hostname: 'sacredsites.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'www.planetware.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'upload.wikimedia.org',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};
 
export default withNextIntl(nextConfig);
