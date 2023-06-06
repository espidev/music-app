/** @type {import('next').NextConfig} */

const nextConfig = {
  swcMinify: true,
}

export default async (phase, {defaultConfig}) => {
  return nextConfig;
}