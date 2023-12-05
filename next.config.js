/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: `${process.env.CORS_ALLOW_CREDENTIALS}`,
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: `${process.env.CORS_ALLOW_ORIGIN}`,
          }, // replace this your actual origin
          {
            key: 'Access-Control-Allow-Methods',
            value: `${process.env.CORS_ALLOW_METHODS}`,
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: `${process.env.CORS_ALLOW_HEADERS}`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
