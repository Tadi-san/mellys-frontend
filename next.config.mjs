/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Required for static export (Macle expects HTML files)
  // distDir: "dist",  // Forces Next.js to output to /dist instead of /.next/out
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
    domains: ['firebasestorage.googleapis.com'],
  },
};

export default nextConfig;