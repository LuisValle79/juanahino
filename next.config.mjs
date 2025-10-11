/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix for Vercel deployment issue with parentheses in directory names
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
}

export default nextConfig
