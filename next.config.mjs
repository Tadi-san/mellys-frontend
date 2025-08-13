/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // Required for static export (Macle expects HTML files)
  // distDir: "dist",  // Forces Next.js to output to /dist instead of /.next/out
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  images: {
    unoptimized: true, // Required for `output: "export"` (disables Image Optimization API)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ae01.alicdn.com",
        port: "",
        pathname: "/kf/**",
      },
    ],
    domains: ['storage.googleapis.com'],
  },
};

export default nextConfig;