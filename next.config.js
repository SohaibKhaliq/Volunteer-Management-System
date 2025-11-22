const nextConfig = {
  // reactStrictMode: false,
  async redirects() {
    return [{
      source: '/',
      destination: '/dashboard',
      permanent: false
    }];
  }
  ,
  async rewrites() {
    // Expose the `(admin)` route group under the `/admin` URL prefix so the
    // middleware can match `/admin/:path*` and protect admin pages.
    return [
      {
        source: '/admin/:path*',
        destination: '/:path*'
      }
    ];
  }
};
export default nextConfig;