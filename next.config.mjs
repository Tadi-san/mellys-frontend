/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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